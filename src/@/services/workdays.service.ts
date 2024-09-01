import prisma_next from "@lib/db";
import { DayOfWeek, WorkDay } from "@prisma/client";
import { CreateWorkDayInput } from "@schemas/workday.schemas";

export const createWorkDay = async (data: CreateWorkDayInput): Promise<WorkDay> => {
  return await prisma_next.workDay.create({ data });
};

export const updateWorkDay = async (
  id: string,
  data: CreateWorkDayInput
): Promise<WorkDay> => {
  return await prisma_next.workDay.update({
    where: { id },
    data,
  });
};

export const deleteWorkDay = async (id: string): Promise<WorkDay> => {
  return await prisma_next.workDay.delete({
    where: { id },
  });
};

export const getWorkDaysByScheduleId = async (scheduleId: string): Promise<WorkDay[]> => {
  return await prisma_next.workDay.findMany({
    where: { scheduleId },
  });
};

export const getWorkDayById = async (id: string): Promise<WorkDay | null> => {
  return await prisma_next.workDay.findUnique({
    where: { id },
  });
};

export const getWorkDayByDaySchedule = async (
  day: DayOfWeek,
  id: string
): Promise<WorkDay | null> => {
  return await prisma_next.workDay.findUnique({
    where: {
      schedule_day: {
        day,
        scheduleId: id,
      },
    },
  });
};

export const filterNewWorkDaysByIndex = async (
  scheduleId: string,
  workDays: { day: DayOfWeek; startTime: Date; endTime: Date }[]
) => {
  // Fetch all existing workdays for the given scheduleId
  const existingWorkDays = await prisma_next.workDay.findMany({
    where: {
      scheduleId: scheduleId,
    },
  });

  // Compare the lengths of existing workdays and user-provided workdays
  const existingLength = existingWorkDays.length;
  const newLength = workDays.length;

  if (newLength <= existingLength) {
    return []; // No new entries
  }

  // Filter new workdays by taking the difference in length
  const newWorkDays = workDays.slice(existingLength);

  // Return the newly added workdays
  return newWorkDays;
};

export const filterNewAndUpdatedWorkDaysByIndex = async (
  scheduleId: string,
  workDays: { day: DayOfWeek; startTime: Date; endTime: Date }[]
) => {
  const existingWorkDays = await prisma_next.workDay.findMany({
    where: { scheduleId },
  });

  const existingLength = existingWorkDays.length;
  const newLength = workDays.length;

  // Workdays that are newly added by the user
  const newWorkDays = newLength > existingLength ? workDays.slice(existingLength) : [];

  // Workdays that are updated by the user
  const updatedWorkDays = workDays
    .slice(0, existingLength)
    .filter((newWorkDay, index) => {
      const existingWorkDay = existingWorkDays[index];
      return (
        existingWorkDay &&
        (existingWorkDay.day !== newWorkDay.day ||
          existingWorkDay.startTime.getTime() !== newWorkDay.startTime.getTime() ||
          existingWorkDay.endTime.getTime() !== newWorkDay.endTime.getTime())
      );
    });

  return { newWorkDays, updatedWorkDays };
};
