"use client";
import React, { useEffect, useMemo, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import FormProvider from "@ui/hook-form/FormProvider";

import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { toast } from "sonner";
import { Heading } from "../heading";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Medication, PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";

import { useRouter } from "next/navigation";
import { SessionUser } from "@type/index";

import { CreateSaleInput, createSaleSchema } from "@schemas/sales.schemas";
import { createSaleAction, updateSaleAction } from "@actions/sales.action";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import SaleItems from "./SaleItems";
import { formatAmountKsh } from "@utils/formatNumber";
import Notification from "@ui/notification";
import { RHFInput } from "@ui/hook-form";

type Props = {
  edit?: boolean;
  currentSale?: Prisma.SaleGetPayload<{
    include: {
      items: true;
    };
  }> | null;
  user: SessionUser | undefined;
  medications: Medication[];
};

export default function SaleForm({ edit, currentSale, user, medications }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      tenantId: user?.tenantId!,
      userId: user?.id,
      customerId: currentSale?.customerId || undefined,
      totalAmount: currentSale?.totalAmount || 0,
      paymentMethod: currentSale?.paymentMethod || PaymentMethod.MPESA,
      paymentStatus: currentSale?.paymentStatus || PaymentStatus.PENDING,
      cashReceived: 0,
      items:
        currentSale?.items.map((item) => ({
          medicationId: item.medicationId,
          quantity: item.quantity,
          price: item.price,
        })) || [],
    }),
    [currentSale, user]
  );
  const methods = useForm<CreateSaleInput>({
    defaultValues,
    resolver: zodResolver(createSaleSchema),
  });

  const paymentOptions = [
    {
      value: PaymentMethod.CASH,
      label: "Cash",
    },
    {
      value: PaymentMethod.MPESA,
      label: "M-pesa",
    },
  ];

  const { handleSubmit, reset, watch, setValue } = methods;

  const totalAmount = watch("totalAmount");

  useEffect(() => {
    reset(defaultValues);
  }, [currentSale, defaultValues, reset]);

  useEffect(() => {
    if (watch("paymentMethod") === "MPESA") setValue("cashReceived", totalAmount);
  }, [setValue, totalAmount, watch]);

  const onSubmit: SubmitHandler<CreateSaleInput> = async (data) => {
    try {
      setIsLoading(true);
      setError("");

      let result;

      if (edit && currentSale) {
        const hasChanges = !(
          currentSale.tenantId === data.tenantId &&
          currentSale.userId === data.userId &&
          currentSale.customerId === data.customerId &&
          currentSale.totalAmount === data.totalAmount &&
          currentSale.paymentMethod === data.paymentMethod &&
          currentSale.paymentStatus === data.paymentStatus &&
          currentSale.items.every((item, index) => {
            const newItem = data.items[index];
            return (
              item.medicationId === newItem.medicationId &&
              item.quantity === newItem.quantity &&
              item.price === newItem.price
            );
          })
        );

        if (hasChanges) {
          result = await updateSaleAction(currentSale.id, data);
        } else {
          toast.info("No changes detected");
          return;
        }
      } else {
        result = await createSaleAction(data);
      }

      if (result.success && !result.warnings) {
        toast.success(result.msg);
        reset();
        router.push(`details?sale=${result.sale?.id}&success=${result.msg}`);
      } else if (result.warnings) {
        router.push(`details?sale=${result.sale?.id}&warning=${result.warnings}`);
      } else {
        toast.error(result.msg);
        setError(result.msg!);
      }
    } catch (error) {
      console.error("Failed to submit sale:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <FadeIn className=" space-y-3 pt-10">
      <DynamicBreadcrumb />
      <Heading className=" font-display pb-4">
        {edit ? "Update sale" : "Add sale"}
      </Heading>

      {error && <Notification type="error" message={error} />}

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <div className="grid gap-2 ">
            <RHFSingleSelect
              name="paymentMethod"
              label="Select payment option"
              options={paymentOptions}
            />
          </div>

          {watch("paymentMethod") === "CASH" && (
            <div className="grid gap-2">
              <RHFInput name="cashReceived" label="Cash Received" type="number" />
            </div>
          )}

          <SaleItems medications={medications} />

          {(watch("cashReceived") as number) > watch("totalAmount") && (
            <dl className="space-y-6   py-10  font-medium text-gray-500   ">
              <div className="flex items-center justify-between border-y-2 border-dashed  border-gray-200 py-6 text-gray-500">
                <dt className="text-base/6">Change*</dt>
                <dd className="text-base/6 text-red-400 ">
                  {watch("change")
                    ? formatAmountKsh(watch("change") as number)
                    : formatAmountKsh(0)}
                </dd>
              </div>
            </dl>
          )}

          <dl className="space-y-6 text-sm  py-10  font-medium text-gray-500   ">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="text-gray-900 ">{formatAmountKsh(watch("totalAmount"))}</dd>
            </div>

            <div className="flex justify-between">
              <dt>Discount</dt>
              <dd className="text-gray-900">_</dd>
            </div>

            <div className="flex items-center justify-between border-t  border-gray-200 pt-6 text-gray-900">
              <dt className="text-base">Total</dt>
              <dd className="text-base">{formatAmountKsh(watch("totalAmount"))}</dd>
            </div>
          </dl>

          <Button
            disabled={isLoading}
            type="submit"
            className=" py-6   font-bold font-display place-self-end "
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update sale" : "Create sale"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
