import prisma_next from "@lib/db";
import { DayOfWeek, Prisma, WorkDay } from "@prisma/client";
import { CreateScheduleInput, UpdateScheduleInput } from "@schemas/schedule.schemas";
import { CreateWorkDayInput } from "@schemas/workday.schemas";

export const createSchedule = async (data: CreateScheduleInput) => {
  return await prisma_next.schedule.create({
    data: {
      workDays: {
        create: data.workDays.map((workDay) => ({
          day: workDay.day,
          startTime: workDay.startTime,
          endTime: workDay.endTime,
        })),
      },
      user: data.userId ? { connect: { id: data.userId } } : undefined,
      daysOff: {
        create: data.daysOff?.map((dayOff) => ({
          name: dayOff.name,
          date: dayOff.date,
          reason: dayOff.reason,
        })),
      },
    },
  });
};

// Retrieve a schedule by its ID
export const getScheduleById = async (id: string) => {
  return await prisma_next.schedule.findUnique({
    where: { id },
    include: { workDays: true, daysOff: true, user: true },
  });
};

export const createWorkDayInvite = async (
  scheduleId: string,
  workDays: { day: DayOfWeek; startTime: Date; endTime: Date }[]
) => {
  if (!Array.isArray(workDays)) {
    throw new Error("workDays should be an array");
  }

  return await prisma_next.$transaction(async (tx) => {
    for (const workDay of workDays) {
      await tx.workDay.upsert({
        where: {
          schedule_day: {
            scheduleId: scheduleId,
            day: workDay.day,
          },
        },
        update: {
          day: workDay.day,
          startTime: workDay.startTime,
          endTime: workDay.endTime,
        },
        create: {
          scheduleId: scheduleId,
          day: workDay.day,
          startTime: workDay.startTime,
          endTime: workDay.endTime,
        },
      });
    }

    // Return the updated schedule with all work days
    return tx.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        workDays: true,
      },
    });
  });
};
export const createDaysOffInvite = async (
  scheduleId: string,
  daysOff: { name: string; date: Date; reason?: string }[]
) => {
  return await prisma_next.$transaction(async (tx) => {
    for (const dayOff of daysOff) {
      await tx.dayOff.upsert({
        where: {
          schedule_date: {
            scheduleId: scheduleId,
            date: dayOff.date,
          },
        },
        update: {
          name: dayOff.name,
          reason: dayOff.reason,
        },
        create: {
          scheduleId: scheduleId,
          name: dayOff.name,
          date: dayOff.date,
          reason: dayOff.reason,
        },
      });
    }

    // Return the updated schedule with all days off
    return tx.schedule.findUnique({
      where: { id: scheduleId },
      include: {
        daysOff: true,
      },
    });
  });
};

export const findDayOffByDateSchedule = async (scheduleId: string, date: Date) => {
  return await prisma_next.dayOff.findUnique({
    where: {
      schedule_date: {
        scheduleId,
        date,
      },
    },
  });
};

// Update an existing schedule

// Delete a schedule by its ID
export const deleteSchedule = async (id: string) => {
  return await prisma_next.schedule.delete({
    where: { id },
  });
};

export const createScheduleInvitation = async (
  tx: Prisma.TransactionClient,
  scheduleData: Prisma.ScheduleCreateInput
) => {
  return await tx.schedule.create({
    data: {
      workDays: {
        create: scheduleData.workDays?.create as Prisma.WorkDayCreateInput[],
      },
      daysOff: {
        create: scheduleData.daysOff?.create as Prisma.DayOffCreateInput[],
      },
    },
  });
};
