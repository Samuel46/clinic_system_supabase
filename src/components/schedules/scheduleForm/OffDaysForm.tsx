"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { CreateScheduleInput, createScheduleSchema } from "@schemas/schedule.schemas";
import { SessionUser } from "@type/index";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState, useTransition } from "react";
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
import { Divider } from "@/components/divider";
import { ChevronRight } from "lucide-react";
import { sendInvitationEmailAction } from "@actions/invitations.action";

interface Props {
  edit?: boolean;
  currentSchedule?: Prisma.ScheduleGetPayload<{
    include: { workDays: true; daysOff: true };
  }> | null;
  user?: SessionUser;
  invitation: Prisma.InvitationGetPayload<{
    include: {
      tenant: true;
    };
  }> | null;
}

export default function OffDaysForm({ edit, currentSchedule, invitation }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();

  const defaultValues = useMemo(
    () => ({
      workDays: currentSchedule?.workDays.map((item) => ({
        day: item.day,
        startTime: item.startTime,
        endTime: item.endTime,
      })),
      daysOff:
        (edit &&
          currentSchedule?.daysOff.map((item) => ({
            name: item.name,
            date: item.date,
            reason: item.reason as string,
          }))) ||
        getKenyanPublicHolidays(),
    }),
    [currentSchedule, edit]
  );

  const methods = useForm<CreateScheduleInput>({
    defaultValues,
    resolver: zodResolver(createScheduleSchema),
  });

  const { handleSubmit, reset, watch } = methods;

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

  const handleCompleteInvitation = async () => {
    if (invitation)
      startTransition(() => {
        sendInvitationEmailAction(invitation!).then((result) => {
          if (result.success) {
            toast.success(result.msg);
            // Refresh or redirect logic here
            router.refresh(); // or use router.push to navigate
            router.push(`/admin/invitations`);
          } else {
            toast.error(result.msg);
          }
        });
        router.refresh();
      });
  };

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

      <ScheduleProgress
        currentDayOff={Boolean(currentSchedule?.daysOff.length)}
        currentWorkDay={Boolean(currentSchedule?.workDays.length)}
        currentInvitation={Boolean(invitation)}
        id={currentSchedule?.id}
      />

      <Heading className=" font-display ">
        {edit ? "Update days off" : "Add days off"}
      </Heading>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6  ">
          <DayOffItems dayoff={currentSchedule?.daysOff ?? []} />

          <Button
            disabled={isLoading}
            type="submit"
            variant={edit ? "secondary" : "default"}
            className=" py-6    items-center place-self-end"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update days off" : "Create days off"}
          </Button>
        </div>
      </FormProvider>

      {edit && (
        <div className="flex  flex-col space-y-6  items-end">
          <Divider />
          <Button
            className="  p-6"
            type="submit"
            onClick={() => handleCompleteInvitation()}
          >
            {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Finish
            <ChevronRight className=" size-5" />
          </Button>
        </div>
      )}
    </FadeIn>
  );
}
