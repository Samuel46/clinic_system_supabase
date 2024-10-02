"use client";
import React, { useEffect, useMemo, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import FormProvider from "@ui/hook-form/FormProvider";
import { RHFDatePicker, RHFInput } from "@ui/hook-form";

import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { toast } from "sonner";
import { Heading } from "../heading";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Patient } from "@prisma/client";

import { CreatePatientInput, createPatientSchema } from "@schemas/patients.schemas";
import { createPatientAction, updatePatientAction } from "@actions/patients.action";
import { useRouter } from "next/navigation";
import { SessionUser } from "@type/index";

import RHFTextArea from "@ui/hook-form/RHFTextArea";
import { hasDataChanged } from "@utils/index";

type Props = {
  edit?: boolean;
  currentPatient?: Patient | null;
  user: SessionUser | undefined;
};

export default function PatientForm({ edit, currentPatient, user }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      tenantId: user?.tenantId!,
      name: currentPatient?.name || "",
      email: currentPatient?.email || "",
      phone: currentPatient?.phone || "",
      address: currentPatient?.address || "",
      dateOfBirth: currentPatient?.dateOfBirth || undefined,
      medicalHistory: currentPatient?.medicalHistory || "",
    }),
    [currentPatient, user]
  );
  const methods = useForm<CreatePatientInput>({
    defaultValues,
    resolver: zodResolver(createPatientSchema),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentPatient, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreatePatientInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      console.log(data);

      if (edit && currentPatient?.id) {
        const currentPatientData = {
          tenantId: currentPatient.tenantId,
          name: currentPatient.name,
          email: currentPatient.email,
          phone: currentPatient.phone,
          address: currentPatient.address,
          dateOfBirth: currentPatient.dateOfBirth!,
          medicalHistory: currentPatient.medicalHistory!,
        };

        const hasChanges = hasDataChanged(currentPatientData, data);

        if (!hasChanges) {
          toast.info("No changes detected, update not needed.");
          setIsLoading(false);
          return;
        }

        result = await updatePatientAction(currentPatient.id, data);
      } else {
        result = await createPatientAction(data);
      }

      if (result.success) {
        toast.success(result.msg);
        router.refresh();
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
    <FadeIn className=" space-y-6 pt-10">
      <DynamicBreadcrumb />
      <div className="flex w-full flex-wrap items-end justify-between gap-4   dark:border-white/10">
        <Heading className=" font-display pb-4">
          {edit ? "Update patient" : "Add patient"}
        </Heading>
      </div>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <div className="grid gap-2">
            <RHFInput name="name" label="Patient Name" id="name" />
          </div>

          <div className="grid gap-2 grid-cols-2">
            <RHFInput name="phone" type="tel" label="Phone Number" id="phone" />
            <RHFInput name="email" type="email" label="Email Address" id="email" />
          </div>

          <div className="grid gap-2 grid-cols-2">
            <RHFDatePicker name="dateOfBirth" label="Date of Birth" />
            <RHFInput name="address" label="Address" id="address" />
          </div>

          <RHFTextArea name="medicalHistory" label="Medical History" />

          <Button disabled={isLoading} type="submit" className="  place-self-start ">
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update patient" : "Create patient"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
