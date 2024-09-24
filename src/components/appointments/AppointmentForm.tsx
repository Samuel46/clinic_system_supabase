"use client";
import React, { useEffect, useMemo, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import FormProvider from "@ui/hook-form/FormProvider";
import { RHFDatePicker, RHFTimePicker } from "@ui/hook-form";

import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { toast } from "sonner";
import { Heading } from "../heading";
import { FadeIn } from "../FadeIn";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Appointment, AppointmentStatus, Patient } from "@prisma/client";

import { useRouter } from "next/navigation";
import { SessionUser } from "@type/index";

import RHFTextArea from "@ui/hook-form/RHFTextArea";
import { hasDataChanged } from "@utils/index";
import {
  CreateAppointmentInput,
  createAppointmentSchema,
} from "@schemas/appointment.schemas";
import {
  createAppointmentAction,
  updateAppointmentAction,
} from "@actions/appointments.action";
import RHFSingleSelect from "@ui/hook-form/RHFSingleSelect";
import { broadcastAppointmentUpdate } from "@lib/supabase/client";

type Props = {
  edit?: boolean;
  currentAppointment?: Appointment | null;
  user: SessionUser | undefined;
  patients: Patient[];
  id?: string;
};

export default function AppointmentForm({
  edit,
  patients,
  currentAppointment,
  user,
  id,
}: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      tenantId: user?.tenantId!,
      patientId: currentAppointment?.patientId || id,
      doctorId: user?.id!,
      date: currentAppointment?.date || undefined,
      startTime: currentAppointment?.startTime || undefined,
      endTime: currentAppointment?.endTime || undefined,
      reason: currentAppointment?.reason || "",
      status: currentAppointment?.status || AppointmentStatus.SCHEDULED,
    }),
    [currentAppointment, user, id]
  );
  const methods = useForm<CreateAppointmentInput>({
    defaultValues,
    resolver: zodResolver(createAppointmentSchema),
  });

  const patientOptions = patients.map((item) => ({
    value: item.id,
    label: item.name,
  }));
  const { handleSubmit, reset, watch } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentAppointment, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateAppointmentInput> = async (data) => {
    try {
      setIsLoading(true);
      let result;

      console.log(data);

      if (edit && currentAppointment?.id) {
        const currentAppointmentData = {
          tenantId: user?.tenantId!,
          patientId: currentAppointment?.patientId,
          doctorId: user?.id,
          date: currentAppointment?.date,
          startTime: currentAppointment.startTime,
          endTime: currentAppointment.endTime,
          reason: currentAppointment?.reason,
          status: currentAppointment?.status,
        };

        const hasChanges = hasDataChanged(currentAppointmentData, data);

        if (!hasChanges) {
          toast.info("No changes detected, update not needed.");
          setIsLoading(false);
          return;
        }

        result = await updateAppointmentAction(currentAppointment.id, data);
        broadcastAppointmentUpdate(result?.data ?? null);
      } else {
        result = await createAppointmentAction(data);
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
      <DynamicBreadcrumb />
      <Heading className=" font-display pb-4">
        {edit ? "Update appointment" : "Add appointment"}
      </Heading>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <RHFSingleSelect
            name="patientId"
            label="Select patient"
            options={patientOptions}
          />
          <div className="grid gap-4 grid-cols-2 ">
            <RHFDatePicker name="date" label="Date" />
            <div className="grid gap-2 grid-cols-2 w-full  ">
              <RHFTimePicker name="startTime" label="Start time" />

              <RHFTimePicker name="endTime" label="End time" />
            </div>
          </div>

          <RHFTextArea name="reason" label="Reason" />

          <Button
            disabled={isLoading}
            type="submit"
            className=" p-6  font-bold font-display items-center place-self-start"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update appointment" : "Create appointment"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
