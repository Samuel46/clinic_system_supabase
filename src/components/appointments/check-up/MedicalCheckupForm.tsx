"use client";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Divider } from "@/components/divider";
import { FadeIn } from "@/components/FadeIn";
import { Heading } from "@/components/heading";
import {
  createMedicalCheckupAction,
  updateMedicalCheckupAction,
} from "@actions/checkups.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Appointment, MedicalCheckup, MedicalRecord, Treatment } from "@prisma/client";
import {
  CreateMedicalCheckupInput,
  createMedicalCheckupSchema,
} from "@schemas/checkup.schemas";
import { SessionUser } from "@type/index";
import { Button } from "@ui/button";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { RHFInput } from "@ui/hook-form";
import FormProvider from "@ui/hook-form/FormProvider";
import RHFTextArea from "@ui/hook-form/RHFTextArea";
import { Icons } from "@ui/icons";

import AppointmentSteps from "../details/AppointmentSteps";

type Props = {
  currentCheckup?: MedicalCheckup | null;
  user: SessionUser | undefined;
  appointment: Appointment | null;
  treatment?: Treatment | null;
  record?: MedicalRecord | null;
};

export default function MedicalCheckupForm({
  currentCheckup,
  user,
  appointment,
  record,
  treatment,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo(
    () => ({
      tenantId: user?.tenantId!,
      patientId: currentCheckup?.patientId || appointment?.patientId,
      doctorId: user?.id,
      appointmentId: appointment?.id,
      checkupDate: currentCheckup?.checkupDate
        ? new Date(currentCheckup.checkupDate)
        : new Date(),
      bloodPressure: currentCheckup?.bloodPressure || "",
      heartRate: currentCheckup?.heartRate || 0,
      respiratoryRate: currentCheckup?.respiratoryRate || 0,
      temperature: currentCheckup?.temperature || 0,
      oxygenSaturation: currentCheckup?.oxygenSaturation || 0,
      weight: currentCheckup?.weight || 0,
      height: currentCheckup?.height || 0,
      bmi: currentCheckup?.bmi || 0,
      notes: currentCheckup?.notes || "",
    }),
    [currentCheckup, user, appointment]
  );

  const methods = useForm<CreateMedicalCheckupInput>({
    defaultValues,
    resolver: zodResolver(createMedicalCheckupSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  console.log(errors);
  useEffect(() => {
    reset(defaultValues);
  }, [currentCheckup, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateMedicalCheckupInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      if (currentCheckup?.id) {
        result = await updateMedicalCheckupAction(currentCheckup.id, data);
      } else {
        result = await createMedicalCheckupAction(data);
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
    <FadeIn className=" space-y-6 grid ">
      <DynamicBreadcrumb />

      <AppointmentSteps
        id={appointment?.id ?? ""}
        currentCheckup={currentCheckup}
        currentMedicalRecord={record}
        currentTreatment={treatment}
      />

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Heading className=" font-display pb-4">
          {currentCheckup ? "Update Medical Checkup" : "Add Medical Checkup"}
        </Heading>
        <div className="grid gap-6  ">
          <div className="grid gap-4 grid-cols-2 ">
            <RHFInput name="bloodPressure" label="Blood Pressure" />
            <div className="grid gap-2 grid-cols-2 w-full  ">
              <RHFInput name="heartRate" label="Heart Rate" type="number" />

              <RHFInput name="respiratoryRate" label="Respiratory Rate" type="number" />
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2 ">
            <RHFInput name="temperature" label="Temperature" type="number" step="0.1" />

            <RHFInput name="oxygenSaturation" label="Oxygen Saturation" type="number" />
          </div>

          <div className="grid gap-4 grid-cols-2 ">
            <RHFInput name="weight" label="Weight" type="number" step="0.1" />
            <div className="grid gap-2 grid-cols-2 w-full  ">
              <RHFInput name="height" label="Height" type="number" step="0.1" />

              <RHFInput name="bmi" label="BMI" type="number" step="0.1" />
            </div>
          </div>

          <RHFTextArea name="notes" label="Notes" />

          <Button
            disabled={isLoading}
            type="submit"
            variant={currentCheckup ? "secondary" : "default"}
            className="place-self-start"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {currentCheckup ? "Update Medical Checkup" : "Add Medical Checkup"}
          </Button>

          <Divider />
        </div>
      </FormProvider>
      {currentCheckup && (
        <Button
          type="submit"
          onClick={() =>
            startTransition(() =>
              router.push(`/admin/appointments/treatment?id=${appointment?.id}`)
            )
          }
          className="place-self-end"
        >
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Continue
          <ChevronRight className=" size-4" />
        </Button>
      )}
    </FadeIn>
  );
}
