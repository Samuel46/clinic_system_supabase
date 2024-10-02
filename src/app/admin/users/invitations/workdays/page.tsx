import { WorkDaysForm } from "@/components/schedules";
import prisma_next from "@lib/db";
import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

async function getData(id: string) {
  const schedule = await prisma_next.schedule.findUnique({
    where: {
      id,
    },

    include: {
      workDays: true,
      daysOff: true,
      Invitation: true,
    },
  });

  return { schedule };
}

export default async function CreateWorkDayPage({ searchParams: { id } }: Props) {
  const { schedule } = await getData(id);

  const hasWorkDays = Boolean(schedule?.workDays?.length);

  return <WorkDaysForm currentSchedule={schedule} edit={hasWorkDays} />;
}
