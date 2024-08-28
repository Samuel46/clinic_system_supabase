"use client";
import React, { useEffect, useMemo, useState, useTransition } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import FormProvider from "@ui/hook-form/FormProvider";

import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { toast } from "sonner";

import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import {
  Appointment,
  FollowUpPeriod,
  MedicalCheckup,
  MedicalRecord,
  Treatment,
} from "@prisma/client";

import {
  CreateMedicalRecordInput,
  createMedicalRecordSchema,
} from "@schemas/medicalRecord.schemas";
import {
  createMedicalRecordAction,
  updateMedicalRecordAction,
} from "@actions/medicalRecords.action";
import { useRouter } from "next/navigation";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import RHFTextArea from "@ui/hook-form/RHFTextArea";
import { SessionUser } from "@type/index";
import { FadeIn } from "@/components/FadeIn";
import { Heading, Subheading } from "@/components/heading";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/description-list";
import { format } from "date-fns";
import { Label } from "@ui/label";
import { cn } from "@lib/utils";
import AppointmentSteps from "../details/AppointmentSteps";
import { BadgeCheck } from "lucide-react";
import { Divider } from "@/components/divider";
import { updateAppointmentStatusAction } from "@actions/appointments.action";

type Props = {
  edit?: boolean;
  currentMedicalRecord?: MedicalRecord | null;
  user: SessionUser | undefined;
  appointment: Appointment | null;
  treatment?: Treatment | null;
  checkup?: MedicalCheckup | null;
};

export default function RecordForm({
  edit = false,
  currentMedicalRecord,
  treatment,
  checkup,
  user,
  appointment,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      tenantId: user?.tenantId,
      patientId: appointment?.patientId,
      doctorId: user?.id,
      appointmentId: appointment?.id,
      treatmentId: treatment?.id,
      checkupId: checkup?.id,
      reasonForVisit: currentMedicalRecord?.reasonForVisit || appointment?.reason,
      followUp: currentMedicalRecord?.followUp || FollowUpPeriod.NO_FOLLOW_UP,
    }),
    [currentMedicalRecord]
  );
  const methods = useForm<CreateMedicalRecordInput>({
    defaultValues,
    resolver: zodResolver(createMedicalRecordSchema),
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  console.log(watch(), "watch");

  useEffect(() => {
    reset(defaultValues);
  }, [currentMedicalRecord, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateMedicalRecordInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      if (currentMedicalRecord) {
        const currentMedicalRecordData = {
          tenantId: currentMedicalRecord?.tenantId || "",
          patientId: currentMedicalRecord?.patientId || "",
          doctorId: currentMedicalRecord?.doctorId || "",
          appointmentId: currentMedicalRecord?.appointmentId || "",
          reasonForVisit: currentMedicalRecord?.reasonForVisit,
          followUp: currentMedicalRecord?.followUp || FollowUpPeriod.ONE_WEEK,
        };

        const hasChanges =
          JSON.stringify(currentMedicalRecordData) !== JSON.stringify(data);

        if (!hasChanges) {
          toast.info("No changes detected, update not needed.");
          setIsLoading(false);
          return;
        }

        result = await updateMedicalRecordAction(currentMedicalRecord.id, data);
      } else {
        result = await createMedicalRecordAction(data);
      }

      if (result.success) {
        toast.success(result.msg);

        if (edit && currentMedicalRecord) {
          router.back();
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

  const handleCompleteAppointment = async () => {
    startTransition(() => {
      updateAppointmentStatusAction({
        id: appointment?.id ?? "",
        status: "COMPLETED",
      }).then((result) => {
        if (result.success) {
          toast.success(result.msg);
          // Refresh or redirect logic here
          router.refresh(); // or use router.push to navigate

          router.push(`/admin/patients/${appointment?.patientId}`);
        } else {
          toast.error(result.msg);
        }
      });
      router.refresh();
    });
  };

  return (
    <FadeIn className=" space-y-6 pt-10 grid">
      <DynamicBreadcrumb />

      <AppointmentSteps
        currentCheckup={checkup}
        currentTreatment={treatment}
        currentMedicalRecord={currentMedicalRecord}
        id={appointment?.id ?? ""}
      />

      <Heading className=" font-display pb-4">
        {currentMedicalRecord ? "Update medical record" : "Add medical record"}
      </Heading>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <>
            <Subheading>Treatment information</Subheading>
            <DescriptionList className="">
              <DescriptionTerm>Treatment type</DescriptionTerm>
              <DescriptionDetails>{treatment?.type}</DescriptionDetails>

              <DescriptionTerm>Description</DescriptionTerm>
              <DescriptionDetails>{treatment?.description}</DescriptionDetails>
            </DescriptionList>
          </>

          <>
            <Subheading>Checkup Information</Subheading>
            <DescriptionList>
              <DescriptionTerm>Checkup Date</DescriptionTerm>
              <DescriptionDetails>
                {format(checkup?.checkupDate ?? new Date(), "PPP")}
              </DescriptionDetails>

              <DescriptionTerm>Blood Pressure</DescriptionTerm>
              <DescriptionDetails>{checkup?.bloodPressure}</DescriptionDetails>

              <DescriptionTerm>Heart Rate</DescriptionTerm>
              <DescriptionDetails>{checkup?.heartRate} bpm</DescriptionDetails>

              <DescriptionTerm>Respiratory Rate</DescriptionTerm>
              <DescriptionDetails>
                {checkup?.respiratoryRate ?? "N/A"} breaths per minute
              </DescriptionDetails>

              <DescriptionTerm>Temperature</DescriptionTerm>
              <DescriptionDetails>{checkup?.temperature ?? "N/A"} °F</DescriptionDetails>

              <DescriptionTerm>Oxygen Saturation</DescriptionTerm>
              <DescriptionDetails>
                {checkup?.oxygenSaturation ?? "N/A"} %
              </DescriptionDetails>

              <DescriptionTerm>Weight</DescriptionTerm>
              <DescriptionDetails>{checkup?.weight ?? "N/A"} lbs</DescriptionDetails>

              <DescriptionTerm>Height</DescriptionTerm>
              <DescriptionDetails>{checkup?.height ?? "N/A"} inches</DescriptionDetails>

              <DescriptionTerm>BMI</DescriptionTerm>
              <DescriptionDetails>{checkup?.bmi ?? "N/A"}</DescriptionDetails>

              <DescriptionTerm>Additional Notes</DescriptionTerm>
              <DescriptionDetails>{checkup?.notes ?? "None"}</DescriptionDetails>
            </DescriptionList>
          </>
          <div className="grid gap-4 ">
            <Label
              htmlFor="followUp"
              className={cn("text-base/6 text-neutral-500  transition-all duration-200")}
            >
              Follow Up
            </Label>
            <RHFSingleSelect
              name="followUp"
              label="Follow Up"
              options={Object.values(FollowUpPeriod).map((type) => ({
                value: type,
                label: type.charAt(0) + type.slice(1).toLowerCase(),
              }))}
            />
          </div>

          <div className="grid gap-4 relative ">
            <Label
              htmlFor="reasonForVisit"
              className={cn(
                watch("reasonForVisit")
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0",
                "text-base/6 text-neutral-500 transform transition-all duration-300 ease-in-out"
              )}
            >
              Reason for Visit
            </Label>
            <RHFTextArea name="reasonForVisit" label="Reason for Visit" />
          </div>

          <Button
            disabled={isLoading}
            type="submit"
            variant={currentMedicalRecord && !edit ? "secondary" : "default"}
            className=" py-6  w-44 font-bold font-display items-center"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {currentMedicalRecord ? "Update record" : "Create record"}
          </Button>

          <Divider />
        </div>
      </FormProvider>

      {currentMedicalRecord && !edit && (
        <Button
          type="submit"
          onClick={() => handleCompleteAppointment()}
          className=" p-6  font-bold  place-self-end items-center"
        >
          {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Finish
          <BadgeCheck className="ml-2 size-4" />
        </Button>
      )}
    </FadeIn>
  );
}
