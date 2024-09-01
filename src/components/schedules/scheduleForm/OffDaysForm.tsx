"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { CreateScheduleInput, createScheduleSchema } from "@schemas/schedule.schemas";
import { SessionUser } from "@type/index";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";

import FormProvider from "@ui/hook-form";

import { FadeIn } from "@/components/FadeIn";
import { Heading } from "@/components/heading";

import ScheduleProgress from "../scheduleProgress";
import DayOffItems from "./items/DayOffItems";
import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { areDayOffsEqual, getKenyanPublicHolidays } from "@utils/index";
import { createDayOffAction, updateDayOffAction } from "@actions/daysoff.action";

interface Props {
  edit?: boolean;
  currentSchedule?: Prisma.ScheduleGetPayload<{
    include: { workDays: true; daysOff: true };
  }> | null;
  user?: SessionUser;
}

export default function OffDaysForm({ edit, currentSchedule }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const hasDaysOff = Boolean(currentSchedule?.daysOff?.length);

  const defaultValues = useMemo(
    () => ({
      workDays: currentSchedule?.workDays.map((item) => ({
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
      })),
      daysOff:
        currentSchedule?.daysOff.map((item) => ({
          name: item.name,
          date: item.date,
          reason: item.reason as string,
        })) || [],
    }),
    [currentSchedule]
  );

  const methods = useForm<CreateScheduleInput>({
    defaultValues,
    resolver: zodResolver(createScheduleSchema),
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  const compareData = (watch()?.daysOff ?? []).map((item) => ({
    name: item.name,
    date: item.date,
    reason: item.reason as string | null,
  }));

  const currentScheduleData = (currentSchedule?.daysOff ?? []).map((item) => ({
    name: item.name,
    date: item.date,
    reason: item.reason,
  }));

  useEffect(() => {
    setHasChanges(!areDayOffsEqual(currentScheduleData, compareData));
  }, [compareData, currentScheduleData, hasChanges]);

  useEffect(() => {
    reset(defaultValues);
  }, [currentSchedule, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateScheduleInput> = async (data) => {
    try {
      setIsLoading(true);

      let result;

      if (edit && currentSchedule) {
        if (hasChanges) {
          result = await updateDayOffAction(currentSchedule.id, data);
        } else {
          toast.info("No changes detected");
          return;
        }
      } else {
        result = await createDayOffAction(data, currentSchedule?.id ?? "");
      }

      if (result.success) {
        toast.success(result.msg);
        // router.push(`details?schedule=${result?.data?.id}&success=${result.msg}`);
      } else {
        toast.error(result.msg);
      }
    } catch (error) {
      console.error("Failed to submit schedule:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };
  return (
    <FadeIn className=" space-y-6 pt-10">
      <DynamicBreadcrumb />

      <ScheduleProgress />

      <Heading className=" font-display ">
        {edit ? "Update days off" : "Add days off"}
      </Heading>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <DayOffItems dayoff={currentSchedule?.daysOff ?? []} />

          <Button
            disabled={isLoading || !hasChanges}
            type="submit"
            className=" py-6   font-bold font-display items-center place-self-end"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update days off" : "Create days off"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
