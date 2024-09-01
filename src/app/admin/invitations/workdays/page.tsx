import { WorkDaysForm } from "@/components/schedules";
import prisma_next from "@lib/db";
import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

async function getData(id: string) {
  const invitation = await prisma_next.invitation.findUnique({
    where: {
      id,
    },

    include: {
      schedule: {
        include: {
          workDays: true,
          daysOff: true,
        },
      },
    },
  });

  return { invitation };
}

export default async function CreateWorkDayPage({ searchParams: { id } }: Props) {
  const { invitation } = await getData(id);

  const hasWorkDays = Boolean(invitation?.schedule?.workDays?.length);

  return <WorkDaysForm currentSchedule={invitation?.schedule} edit={hasWorkDays} />;
}
