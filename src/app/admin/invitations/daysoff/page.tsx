import { OffDaysForm } from "@/components/schedules";
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
    },
  });

  return { schedule };
}
export default async function CreateDayOffPage({ searchParams: { id } }: Props) {
  const { schedule } = await getData(id);

  const hasDaysOff = Boolean(schedule?.daysOff?.length);

  return <OffDaysForm currentSchedule={schedule ?? null} edit={hasDaysOff} />;
}
