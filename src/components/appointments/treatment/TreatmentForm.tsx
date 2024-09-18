"use client";

import { FadeIn } from "@/components/FadeIn";
import { Heading } from "@/components/heading";
import { createTreatmentAction, updateTreatmentAction } from "@actions/treatment.action";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Appointment,
  MedicalCheckup,
  MedicalRecord,
  Treatment,
  TreatmentType,
} from "@prisma/client";
import { CreateTreatmentInput, createTreatmentSchema } from "@schemas/treament.schemas";
import { SessionUser } from "@type/index";
import { Button } from "@ui/button";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import FormProvider from "@ui/hook-form";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import RHFTextArea from "@ui/hook-form/RHFTextArea";
import { Icons } from "@ui/icons";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Divider } from "@/components/divider";
import { ChevronRight } from "lucide-react";
import AppointmentSteps from "../details/AppointmentSteps";

type Props = {
  currentTreatment?: Treatment | null;
  currentCheckup?: MedicalCheckup | null;
  user: SessionUser | undefined;
  appointment: Appointment | null;
  currentMedicalRecord?: MedicalRecord | null;
};
export default function TreatmentForm({
  currentTreatment,
  user,
  appointment,
  currentCheckup,
  currentMedicalRecord,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues = useMemo(
    () => ({
      tenantId: user?.tenantId,
      patientId: appointment?.patientId,
      doctorId: user?.id,
      appointmentId: appointment?.id,

      type: currentTreatment?.type || TreatmentType.MEDICATION,
      description: currentTreatment?.description || "",
    }),
    [currentTreatment, user, appointment]
  );

  const methods = useForm<CreateTreatmentInput>({
    defaultValues,
    resolver: zodResolver(createTreatmentSchema),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentTreatment, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateTreatmentInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      if (currentTreatment?.id) {
        result = await updateTreatmentAction(currentTreatment.id, data);
      } else {
        result = await createTreatmentAction(data);
      }

      if (result.success) {
        toast.success(result.msg);
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
    <FadeIn className=" space-y-6 pt-10 grid">
      <DynamicBreadcrumb />

      <AppointmentSteps
        id={appointment?.id ?? ""}
        currentCheckup={currentCheckup}
        currentMedicalRecord={currentMedicalRecord}
        currentTreatment={currentTreatment}
      />

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Heading className=" font-display pb-4">
          {currentTreatment ? "Update Treatment" : "Add Treatment"}
        </Heading>
        <div className="grid gap-6  ">
          <RHFSingleSelect
            name="type"
            label="Treatment Type"
            options={Object.values(TreatmentType).map((type) => ({
              value: type,
              label: type.charAt(0) + type.slice(1).toLowerCase(),
            }))}
          />

          <RHFTextArea name="description" label="Description" />

          <Button
            disabled={isLoading}
            type="submit"
            variant={!currentTreatment ? "default" : "secondary"}
            className=" p-6  font-bold place-self-start"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {currentTreatment ? "Update Treatment" : "Create Treatment"}
          </Button>

          <Divider />
        </div>
      </FormProvider>
      {currentTreatment && (
        <Button
          type="submit"
          onClick={() =>
            router.push(`/admin/appointments/medical-record?id=${appointment?.id}`)
          }
          className=" p-6  font-bold  place-self-end items-center"
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Medical record
          <ChevronRight className=" size-5" />
        </Button>
      )}
    </FadeIn>
  );
}
