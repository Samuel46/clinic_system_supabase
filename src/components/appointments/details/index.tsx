"use client";
import { format } from "date-fns";
import { ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

import { Avatar, AvatarButton } from "@/components/avatar";
import { Badge } from "@/components/badge";
import { DescriptionDetails, DescriptionList, DescriptionTerm } from "@/components/description-list";
import { Heading, Subheading } from "@/components/heading";
import useAppointmentPresence from "@hooks/useAppointmentPresence ";
import { AppointmentStatus, Prisma } from "@prisma/client";
import { SessionUser } from "@type/index";
import { Button } from "@ui/button";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { getInitials } from "@utils/index";

import AppointmentSteps from "./AppointmentSteps";

type Props = {
	appointment: Prisma.AppointmentGetPayload<{
		include: {
			patient: true;
			doctor: true;
		};
	}> | null;
	user?: SessionUser;
};

export default function AppointmentDetails({ appointment, user }: Props) {
	const activeUsers = useAppointmentPresence(appointment?.id ?? "", user?.id ?? "", user?.name ?? "");
	const [isPending, startTransition] = useTransition();

	console.log(activeUsers, "apppointments");
	const router = useRouter();
	return (
		<div>
			<div className="space-y-6 mt-10">
				<DynamicBreadcrumb />

				<div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
					<Heading>Appointment details</Heading>
					<div className="flex gap-4">
						<Button variant="outline" onClick={() => router.push(`/admin/appointments/edit?id=${appointment?.id}`)}>
							Edit
						</Button>
					</div>
				</div>

				<>
					<Subheading>Staff information</Subheading>
					<DescriptionList className="mt-4">
						<DescriptionTerm>Active staff working on this</DescriptionTerm>
						<DescriptionDetails className="flex gap-x-2">
							{activeUsers.map((item) => (
								<Popover key={item.userId}>
									<PopoverTrigger>
										<AvatarButton
											square
											initials={getInitials(item.username)}
											className="size-8 bg-zinc-900 text-white dark:bg-white dark:text-black"
										/>
									</PopoverTrigger>
									<PopoverContent>
										<DescriptionList>
											<DescriptionTerm>Full name</DescriptionTerm>
											<DescriptionDetails>{item.username}</DescriptionDetails>
											<DescriptionTerm>Status</DescriptionTerm>
											<DescriptionDetails>
												<Badge color="lime">{item.status}</Badge>
											</DescriptionDetails>
										</DescriptionList>
									</PopoverContent>
								</Popover>
							))}
						</DescriptionDetails>
					</DescriptionList>
					<Subheading>Patient Information</Subheading>
					<DescriptionList className="mt-4">
						<DescriptionTerm>Full Name</DescriptionTerm>
						<DescriptionDetails>{appointment?.patient.name}</DescriptionDetails>

						<DescriptionTerm>Email</DescriptionTerm>
						<DescriptionDetails>{appointment?.patient.email}</DescriptionDetails>

						<DescriptionTerm>Phone</DescriptionTerm>
						<DescriptionDetails>{appointment?.patient.phone}</DescriptionDetails>

						<DescriptionTerm>Address</DescriptionTerm>
						<DescriptionDetails>{appointment?.patient.address}</DescriptionDetails>

						<DescriptionTerm>Date of Birth</DescriptionTerm>
						<DescriptionDetails>{format(appointment?.patient.dateOfBirth ?? new Date(), "PPP")}</DescriptionDetails>

						<DescriptionTerm>Medical History</DescriptionTerm>
						<DescriptionDetails>{appointment?.patient.medicalHistory}</DescriptionDetails>
					</DescriptionList>
				</>

				<>
					<Subheading>Appointment Information</Subheading>
					<DescriptionList>
						<DescriptionTerm>Doctor</DescriptionTerm>
						<DescriptionDetails>{appointment?.doctor.name}</DescriptionDetails>

						<DescriptionTerm>Time</DescriptionTerm>
						<DescriptionDetails>
							{format(appointment?.startTime ?? new Date(), "p")} to{" "}
							{format(appointment?.endTime ?? new Date(), "p")}
						</DescriptionDetails>

						<DescriptionTerm>Reason</DescriptionTerm>
						<DescriptionDetails>{appointment?.reason}</DescriptionDetails>

						<DescriptionTerm>Status</DescriptionTerm>
						<DescriptionDetails>
							<Badge
								className="max-w-[250px] truncate font-medium text-pretty"
								color={
									appointment?.status === AppointmentStatus.SCHEDULED
										? "sky"
										: appointment?.status === AppointmentStatus.COMPLETED
										? "green"
										: "red"
								}
							>
								{appointment?.status}
							</Badge>
						</DescriptionDetails>

						<DescriptionTerm>Created At</DescriptionTerm>
						<DescriptionDetails>{format(appointment?.createdAt ?? new Date(), "PPP p")}</DescriptionDetails>

						<DescriptionTerm>Updated At</DescriptionTerm>
						<DescriptionDetails>{format(appointment?.updatedAt ?? new Date(), "PPP p")}</DescriptionDetails>
					</DescriptionList>
				</>
			</div>

			<div className="flex flex-shrink-0 justify-end px-4 py-4 gap-x-6">
				{appointment?.status === "COMPLETED" && (
					<Button
						className=" font-semibold p-6"
						variant="secondary"
						type="submit"
						onClick={() => startTransition(() => router.push(`/admin/appointments`))}
					>
						Cancel
						<X className="ml-2 size-4" />
					</Button>
				)}

				<Button
					className=" font-semibold p-6"
					type="submit"
					onClick={() => startTransition(() => router.push(`/admin/appointments/check-up?id=${appointment?.id}`))}
				>
					{appointment?.status === "COMPLETED" ? "Update" : "Continue"}
					<ChevronRight className=" ml-2 size-4" />
				</Button>
			</div>
		</div>
	);
}
