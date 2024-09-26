"use client";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Heading } from "../heading";
import FormProvider from "@ui/hook-form/FormProvider";
import { RHFDatePicker, RHFInput } from "@ui/hook-form";
import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import {
  Dosage,
  Duration,
  Frequency,
  Medication,
  Patient,
  Prescription,
} from "@prisma/client";

import { toast } from "sonner";

import { useRouter } from "next/navigation";

import { SessionUser } from "@type/index";

import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import {
  CreatePrescriptionInput,
  createPrescriptionSchema,
} from "@schemas/prescriptions.schemas";
import {
  createPrescriptionAction,
  updatePrescriptionAction,
} from "@actions/prescriptions.action";
import RHFTextArea from "@ui/hook-form/RHFTextArea";

type Props = {
  edit?: boolean;
  currentPrescription?: Prescription | null;
  user: SessionUser | undefined;
  medications: Medication[];
  patients: Patient[];
};
export default function PrescriptionForm({
  edit,
  currentPrescription,
  user,
  medications,
  patients,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      tenantId: user?.tenantId ?? "",
      patientId: currentPrescription?.patientId || "",
      doctorId: user?.id || "",
      medicationId: currentPrescription?.medicationId || "",
      dosage: currentPrescription?.dosage || Dosage.FOUR_CAPSULES,
      frequency: currentPrescription?.frequency || Frequency.EVERY_EIGHT_HOURS,
      duration: currentPrescription?.duration || Duration.FIVE_DAYS,
      instructions: currentPrescription?.instructions || "",
    }),
    [currentPrescription, user]
  );
  const methods = useForm<CreatePrescriptionInput>({
    defaultValues,
    resolver: zodResolver(createPrescriptionSchema),
  });

  const medicationOptions = medications.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const patientsOptions = patients.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, currentPrescription]);

  const onSubmit: SubmitHandler<CreatePrescriptionInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      // Determine if we are in edit mode and if there are any changes
      if (edit && currentPrescription) {
        const hasChanges =
          currentPrescription.patientId !== data.patientId ||
          currentPrescription.medicationId !== data.medicationId ||
          currentPrescription.dosage !== data.dosage ||
          currentPrescription.frequency !== data.frequency ||
          currentPrescription.duration !== data.duration ||
          currentPrescription.instructions !== data.instructions;

        if (hasChanges) {
          result = await updatePrescriptionAction(currentPrescription.id, data);
        } else {
          toast.info("No changes detected");
          setIsLoading(false);
          return;
        }
      } else {
        // Call the create medication action with form data
        result = await createPrescriptionAction(data);
      }

      if (result.success) {
        // Show success notification
        toast.success(result.msg);
        router.back();
      } else {
        // Show error notification
        toast.error(result.msg);
      }
    } catch (error) {
      console.error("Failed to submit prescription:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <FadeIn className=" space-y-6 ">
      <DynamicBreadcrumb />
      <div className="flex w-full flex-wrap items-center justify-between gap-4   dark:border-white/10">
        <Heading className=" font-display  text-sm">
          {edit ? "Update prescription" : "Add prescription"}
        </Heading>
      </div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 w-full">
          <div className="grid gap-2">
            <RHFInput name="dosage" label="Dosage" id="dosage" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <RHFSingleSelect
              name="medicationId"
              label="Select medication"
              options={medicationOptions}
            />

            <RHFSingleSelect
              name="patientId"
              label="Select patient"
              options={patientsOptions}
            />
          </div>

          <div className="grid gap-2 grid-cols-2">
            <RHFInput name="frequency" label="Frequency" />

            <RHFInput name="duration" label="Duration" />
          </div>

          <div className="grid gap-2">
            <RHFTextArea name="instructions" label="Instructions" />
          </div>

          <Button disabled={isLoading} type="submit" className="place-self-start">
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update prescription" : "Create prescription"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
