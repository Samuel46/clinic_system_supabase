"use client";

import { BadgeCheck, Copy, OctagonAlert, Phone, ReceiptText, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/badge";
import { FadeIn } from "@/components/FadeIn";
import { Heading } from "@/components/heading";
import { updateInventoryAction, updateInventoryLevelsAction } from "@actions/inventory.action";
import { changePaymentStatusAction } from "@actions/sales.action";
import { PaymentStatus, Prisma, SaleItem } from "@prisma/client";
import { Button } from "@ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/card";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Icons } from "@ui/icons";
import Notification from "@ui/notification";
import { Separator } from "@ui/separator";
import { formatAmountKsh } from "@utils/formatNumber";
import { fDateTime } from "@utils/formatTime";

interface SaleCalculation {
	total: number;
}
type Props = {
	sale: Prisma.SaleGetPayload<{
		include: {
			items: {
				include: {
					medication: true;
				};
			};
		};
	}> | null;
	warning?: string;
	success?: string;
};
export default function SaleDetails({ sale, warning, success }: Props) {
	const [isPending, startTransition] = useTransition();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const router = useRouter();

	function calculateSaleTotals(items: SaleItem[]): SaleCalculation {
		return items.reduce<SaleCalculation>(
			(acc, item) => {
				const subtotal = item.quantity * item.price;
				acc.total += subtotal;
				return acc;
			},
			{ total: 0 }
		);
	}

	const { total } = calculateSaleTotals(sale?.items!);

	// const handleCompleteSale = () => {
	//   setIsLoading(true);

	//   startTransition(async () => {
	//     await changePaymentStatusAction(sale?.id!, "COMPLETED").then((res) => {
	//       if (res.success) {
	//         toast.success(res.msg);
	//         router.refresh();
	//         router.push("/admin/sales");
	//         setIsLoading(false);
	//       }
	//     });
	//   });
	// };

	const handleCompleteSale = () => {
		setIsLoading(true);

		startTransition(async () => {
			await updateInventoryLevelsAction(sale?.items ?? [], sale?.tenantId ?? "", sale?.id ?? "").then((res) => {
				if (res.success) {
					toast.success(res.msg);

					router.push("/admin/sales");
					setIsLoading(false);
				} else {
					toast.error(res.msg);
				}
			});
		});
	};

	const handleUpdatePaymentStatus = (status: PaymentStatus) => {
		if (status === "COMPLETED") {
			setIsLoading(true);
		}
		startTransition(async () => {
			const result = await changePaymentStatusAction(sale?.id!, status);
			if (result.success) {
				toast.success(result.msg);
				router.refresh();
				router.push("/admin/sales");
				setIsLoading(false);
			} else {
				toast.error(result.msg);
				setIsLoading(false);
			}
		});
	};

	return (
		<FadeIn className="space-y-3">
			<DynamicBreadcrumb />
			<div className="flex w-full flex-wrap items-end justify-between gap-4  border-zinc-950/10 pb-6 dark:border-white/10">
				<Heading>Order Details</Heading>
				<div className="flex gap-4">
					<Button
						disabled={isPending && !isLoading}
						variant="secondary"
						onClick={() => handleUpdatePaymentStatus("FAILED")}
					>
						Cancel
					</Button>
					<Button disabled={isLoading} onClick={() => handleCompleteSale()}>
						{isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
						Complete
					</Button>
				</div>
			</div>
			{/* {warning && <Notification type="warning" message={warning} />}
      {success && <Notification type="success" message={success} />} */}
			<Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
				<CardHeader className="flex flex-row items-start bg-muted/50">
					<div className="grid gap-0.5">
						<CardTitle className="group flex items-center gap-2 text-lg">
							{sale?.id}
							<Button size="icon" variant="outline" className="h-6 w-6  transition-opacity group-hover:opacity-100">
								<Copy className="h-3 w-3" />
								<span className="sr-only">Copy Order ID</span>
							</Button>
						</CardTitle>
						<CardDescription>{fDateTime(sale?.createdAt!)}</CardDescription>
					</div>
					<div className="ml-auto flex items-center gap-1">
						<Button size="sm" variant="outline" className="h-8 gap-1">
							<ReceiptText className="h-3.5 w-3.5" />
							<span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">Generate Receipt</span>
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-6 text-sm">
					<div className="grid gap-3">
						<div className="font-semibold">Order Details</div>
						<ul className="grid gap-3">
							{sale?.items.map((item) => (
								<li key={item.id} className="flex items-center justify-between">
									<span className="text-muted-foreground">
										{item.medication.name} x <span>{item.quantity}</span>
									</span>
									<span>{formatAmountKsh(item.price)}</span>
								</li>
							))}
						</ul>

						<Separator className="my-2" />
						<ul className="grid gap-3">
							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Subtotal</span>
								<span>{formatAmountKsh(total)}</span>
							</li>

							<li className="flex items-center justify-between">
								<span className="text-muted-foreground">Tax</span>
								<span>_</span>
							</li>
							<li className="flex items-center justify-between font-semibold">
								<span className="text-muted-foreground">Total</span>
								<span>{formatAmountKsh(total)}</span>
							</li>
						</ul>
					</div>

					<Separator className="my-4" />
					<div className="grid gap-3">
						<div className="font-semibold">Payment Status</div>
						<dl className="grid gap-3">
							<div className="flex items-center justify-between">
								<dt className="flex items-center gap-1 text-muted-foreground">
									<Badge
										color={
											sale?.paymentStatus === "COMPLETED"
												? "lime"
												: sale?.paymentStatus === "PENDING"
												? "amber"
												: "rose"
										}
									>
										{sale?.paymentStatus === "COMPLETED" ? (
											<BadgeCheck className="h-4 w-4" />
										) : sale?.paymentStatus === "PENDING" ? (
											<OctagonAlert className="h-4 w-4" />
										) : (
											<TriangleAlert className="h-4 w-4" />
										)}

										{sale?.paymentStatus}
									</Badge>
								</dt>
								<dd>**** **** ****</dd>
							</div>
						</dl>
					</div>
					<Separator className="my-4" />
					<div className="grid gap-3">
						<div className="font-semibold">Payment Information</div>
						<dl className="grid gap-3">
							<div className="flex items-center justify-between">
								<dt className="flex items-center gap-1 text-muted-foreground">
									<Phone className="h-4 w-4" />
									{sale?.paymentMethod}
								</dt>
								<dd>**** **** ****</dd>
							</div>
						</dl>
					</div>
				</CardContent>
				<CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
					<div className="text-xs text-muted-foreground">Updated {fDateTime(sale?.updatedAt!)}</div>
				</CardFooter>
			</Card>
		</FadeIn>
	);
}
