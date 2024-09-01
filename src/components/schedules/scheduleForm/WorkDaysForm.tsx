"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DayOfWeek, Prisma } from "@prisma/client";
import { CreateScheduleInput, createScheduleSchema } from "@schemas/schedule.schemas";
import { SessionUser } from "@type/index";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";

import FormProvider from "@ui/hook-form";

import { createTime } from "@utils/index";
import { FadeIn } from "@/components/FadeIn";
import { Heading } from "@/components/heading";
import WorkDayForm from "./items/WorkDayItems";

import ScheduleProgress from "../scheduleProgress";

import { Button } from "@ui/button";
import { Icons } from "@ui/icons";
import { createWorkDayAction, updateWorkDayAction } from "@actions/workdays.actions";

interface Props {
  edit?: boolean;
  currentSchedule?: Prisma.ScheduleGetPayload<{
    include: { workDays: true; daysOff: true };
  }> | null;
  user?: SessionUser;
}

export default function WorkDaysForm({ edit, currentSchedule, user }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const defaultWorkDays = useMemo(
    () => [
      { day: DayOfWeek.Monday, startTime: createTime(9, 0), endTime: createTime(17, 0) },
      { day: DayOfWeek.Tuesday, startTime: createTime(9, 0), endTime: createTime(17, 0) },
      {
        day: DayOfWeek.Wednesday,
        startTime: createTime(9, 0),
        endTime: createTime(17, 0),
      },
      {
        day: DayOfWeek.Thursday,
        startTime: createTime(9, 0),
        endTime: createTime(17, 0),
      },
      { day: DayOfWeek.Friday, startTime: createTime(9, 0), endTime: createTime(17, 0) },
    ],
    []
  );

  const defaultValues = useMemo(
    () => ({
      workDays:
        currentSchedule?.workDays.map((item) => ({
          day: item.day,
          startTime: item.startTime,
          endTime: item.endTime,
        })) || defaultWorkDays,
    }),
    [currentSchedule, defaultWorkDays]
  );

  const methods = useForm<CreateScheduleInput>({
    defaultValues,
    resolver: zodResolver(createScheduleSchema),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [currentSchedule, defaultValues, reset]);

  const onSubmit: SubmitHandler<CreateScheduleInput> = async (data) => {
    try {
      setIsLoading(true);

      let result;

      if (edit && currentSchedule) {
        const hasChanges = !(
          JSON.stringify(currentSchedule.workDays) === JSON.stringify(data.workDays)
        );

        if (hasChanges) {
          result = await updateWorkDayAction(currentSchedule.id, data);
        } else {
          toast.info("No changes detected");
          return;
        }
      } else {
        result = await createWorkDayAction(data, currentSchedule?.id ?? "");
      }

      if (result.success) {
        toast.success(result.msg);
        router.refresh();
        // router.push(`daysoff?id=${currentSchedule?.id}`);
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

      <ScheduleProgress id="sssss" />

      <Heading className=" font-display ">
        {edit ? "Update schedule" : "Add schedule"}
      </Heading>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <WorkDayForm workdays={currentSchedule?.workDays ?? []} />

          <Button
            disabled={isLoading}
            type="submit"
            className=" py-6   font-bold font-display items-center place-self-end"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update schedule" : "Create schedule"}
          </Button>
        </div>
      </FormProvider>
    </FadeIn>
  );
}
