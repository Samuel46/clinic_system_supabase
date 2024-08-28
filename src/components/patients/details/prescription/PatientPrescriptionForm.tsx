"use client";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";

import FormProvider from "@ui/hook-form/FormProvider";

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
import { FadeIn } from "@/components/FadeIn";
import { Heading } from "@/components/heading";

type Props = {
  edit?: boolean;
  currentPrescription?: Prescription | null;
  user: SessionUser | undefined;
  medications: Medication[];
  patient: Patient | null;
};
export default function PatientPrescriptionForm({
  edit,
  currentPrescription,
  user,
  medications,
  patient,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      tenantId: user?.tenantId,
      patientId: patient?.id,
      doctorId: user?.id || "",
      medicationId: currentPrescription?.medicationId || "",
      dosage: currentPrescription?.dosage || Dosage.ONE_CAPSULE,
      frequency: currentPrescription?.frequency || Frequency.TWICE_A_DAY,
      duration: currentPrescription?.duration || Duration.FIVE_DAYS,
      instructions: currentPrescription?.instructions || "",
    }),
    [currentPrescription, user, patient]
  );
  const methods = useForm<CreatePrescriptionInput>({
    defaultValues,
    resolver: zodResolver(createPrescriptionSchema),
  });

  const medicationOptions = medications.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  console.log(errors, "errors");

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
        router.push(`/admin/patients/${patient?.id}?tab="prescriptions"`);
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
    <FadeIn className=" space-y-3 pt-10">
      <DynamicBreadcrumb />
      <div className="flex w-full flex-wrap items-center justify-between gap-4  pb-6 dark:border-white/10">
        <Heading className=" font-display pb-4">
          {currentPrescription ? "Update prescription" : "Add prescription"}
        </Heading>
      </div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 w-full">
          <div className="grid grid-cols-2 gap-2">
            <RHFSingleSelect
              name="medicationId"
              label="Select medication"
              options={medicationOptions}
            />

            <RHFSingleSelect
              name="dosage"
              label="Dosage"
              options={Object.values(Dosage).map((type) => ({
                value: type,
                label: type.charAt(0) + type.slice(1).toLowerCase(),
              }))}
            />
          </div>

          <div className="grid gap-2 grid-cols-2">
            <RHFSingleSelect
              name="frequency"
              label="Frequency"
              options={Object.values(Frequency).map((type) => ({
                value: type,
                label: type.charAt(0) + type.slice(1).toLowerCase(),
              }))}
            />

            <RHFSingleSelect
              name="duration"
              label="Duration"
              options={Object.values(Duration).map((type) => ({
                value: type,
                label: type.charAt(0) + type.slice(1).toLowerCase(),
              }))}
            />
          </div>

          <div className="grid gap-2">
            <RHFTextArea name="instructions" label="Instructions" />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            className=" py-6   font-bold font-display items-center place-self-start"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {currentPrescription ? "Update prescription" : "Create prescription"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
