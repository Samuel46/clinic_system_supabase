"use client";
import React, { useEffect, useMemo, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import FormProvider from "@ui/hook-form/FormProvider";
import { RHFInput } from "@ui/hook-form";

import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { toast } from "sonner";
import { Heading } from "../heading";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Billing, BillingStatus, Patient, PaymentMethod } from "@prisma/client";

import { useRouter } from "next/navigation";
import { SessionUser } from "@type/index";
import { hasDataChanged } from "@utils/index";
import { CreateBillingInput, createBillingSchema } from "@schemas/bills.schemas";
import { createBillingAction, updateBillingAction } from "@actions/bills.action";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";

type Props = {
  edit?: boolean;
  currentBilling?: Billing | null;
  user: SessionUser | undefined;
  patients: Patient[];
  show?: boolean;
};

export default function BillForm({
  edit,
  currentBilling,
  user,
  patients,
  show = true,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      tenantId: user?.tenantId,
      patientId: currentBilling?.patientId || "",
      userId: user?.id,
      amount: currentBilling?.amount || 0,
      status: currentBilling?.status || BillingStatus.UNPAID,
      paymentMethod: currentBilling?.paymentMethod || PaymentMethod.CASH,
    }),
    [currentBilling, user]
  );
  const methods = useForm<CreateBillingInput>({
    defaultValues,
    resolver: zodResolver(createBillingSchema),
  });

  const patientOptions = patients.map((item) => ({
    value: item.id,
    label: item.name,
  }));

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

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentBilling, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateBillingInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      console.log(data);

      if (edit && currentBilling?.id) {
        const currentBillData = {
          tenantId: currentBilling?.tenantId,
          patientId: currentBilling?.patientId,
          userId: currentBilling?.userId,
          amount: currentBilling?.amount,
          status: currentBilling?.status,
          paymentMethod: currentBilling?.paymentMethod,
        };

        const hasChanges = hasDataChanged(currentBillData, data);

        if (!hasChanges) {
          toast.info("No changes detected, update not needed.");
          setIsLoading(false);
          return;
        }

        result = await updateBillingAction(currentBilling.id, data);
      } else {
        result = await createBillingAction(data);
      }

      if (result.success) {
        toast.success(result.msg);
        router.back();
        reset();
      } else {
        toast.error(result.msg);
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <FadeIn className=" space-y-3 pt-10">
      {show && <DynamicBreadcrumb />}

      <Heading className=" font-display pb-4">
        {edit ? "Update bill" : "Add bill"}
      </Heading>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <div className="grid gap-2 ">
            <RHFSingleSelect
              name="patientId"
              label="Select patient"
              options={patientOptions}
            />
          </div>

          <div className="grid gap-2 grid-cols-2">
            <RHFSingleSelect
              name="paymentMethod"
              label="Select payment option"
              options={paymentOptions}
            />
            <RHFSingleSelect
              name="status"
              label="Payment status"
              options={Object.values(BillingStatus).map((type) => ({
                value: type,
                label: type.charAt(0) + type.slice(1).toLowerCase(),
              }))}
            />
          </div>

          <div className="grid gap-2 ">
            <RHFInput
              name="amount"
              type="number"
              disabled={user?.role !== "Admin" && edit}
              label="Amount"
              id="amount"
            />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className=" py-6  w-44 font-bold font-display items-center"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update bill" : "Create bill"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
