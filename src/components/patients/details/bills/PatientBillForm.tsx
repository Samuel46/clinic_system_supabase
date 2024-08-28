"use client";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import FormProvider from "@ui/hook-form/FormProvider";
import { RHFInput } from "@ui/hook-form";

import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { toast } from "sonner";

import { Billing, BillingStatus, Patient, PaymentMethod } from "@prisma/client";

import { useRouter } from "next/navigation";

import { hasDataChanged } from "@utils/index";
import { CreateBillingInput, createBillingSchema } from "@schemas/bills.schemas";
import { createBillingAction, updateBillingAction } from "@actions/bills.action";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import { FadeIn } from "@/components/FadeIn";
import { Heading } from "@/components/heading";
import { ChevronLeft } from "lucide-react";
import { SessionUser } from "@type/index";

type Props = {
  edit?: boolean;
  currentBilling?: Billing | null;
  patient?: Patient | null;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  user?: SessionUser;
};

export default function PatientBillForm({
  edit,
  currentBilling,
  patient,
  setOpen,
  user,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  console.log(user);

  const defaultValues = useMemo(
    () => ({
      tenantId: currentBilling?.tenantId || patient?.tenantId,
      patientId: currentBilling?.patientId || patient?.id,
      userId: user?.id,
      amount: currentBilling?.amount || 0,
      status: currentBilling?.status || BillingStatus.UNPAID,
      paymentMethod: currentBilling?.paymentMethod || PaymentMethod.CASH,
    }),
    [currentBilling, patient, user]
  );
  const methods = useForm<CreateBillingInput>({
    defaultValues,
    resolver: zodResolver(createBillingSchema),
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

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  console.log(errors, "errors");

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
        if (currentBilling) {
          router.back();
        }
        if (setOpen) {
          setOpen(false);
        }

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
    <FadeIn className=" space-y-6 pt-10">
      <div className="max-lg:hidden">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400"
        >
          <ChevronLeft className="size-4  dark:fill-zinc-500" />
          Patient
        </Button>
      </div>
      <Heading className=" font-display pb-4">
        {edit ? "Update bill" : "Add bill"}
      </Heading>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <div className="grid gap-2">
            <RHFSingleSelect
              name="status"
              label="Payment status"
              options={Object.values(BillingStatus).map((type) => ({
                value: type,
                label: type.charAt(0) + type.slice(1).toLowerCase(),
              }))}
            />
          </div>

          <div className="grid gap-2 grid-cols-2">
            <RHFInput
              disabled={user?.role !== "Admin" && edit}
              name="amount"
              type="number"
              label="Amount"
              id="amount"
            />
            <RHFSingleSelect
              name="paymentMethod"
              label="Select payment option"
              options={paymentOptions}
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
