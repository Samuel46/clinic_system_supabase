import prisma_next from "@lib/db";
import { DayOff } from "@prisma/client";
import { CreateDayOffInput } from "@schemas/dayoff.schemas";

export const createDayOff = async (data: CreateDayOffInput): Promise<DayOff> => {
  return await prisma_next.dayOff.create({ data });
};

export const updateDayOff = async (
  id: string,
  data: CreateDayOffInput
): Promise<DayOff> => {
  return await prisma_next.dayOff.update({
    where: { id },
    data,
  });
};

export const deleteDayOff = async (id: string): Promise<DayOff> => {
  return await prisma_next.dayOff.delete({
    where: { id },
  });
};

export const getDayOffsByScheduleId = async (scheduleId: string): Promise<DayOff[]> => {
  return await prisma_next.dayOff.findMany({
    where: { scheduleId },
  });
};

export const getDayOffById = async (id: string): Promise<DayOff | null> => {
  return await prisma_next.dayOff.findUnique({
    where: { id },
  });
};

export const getDayOffByName = async (name: string): Promise<DayOff | null> => {
  return await prisma_next.dayOff.findUnique({
    where: { name: name.toLowerCase() },
  });
};

export const getAllDayOff = async (id: string): Promise<DayOff[] | null> => {
  return await prisma_next.dayOff.findMany({
    where: { scheduleId: id },
  });
};

export const findExistingDayOffs = async (scheduleId: string, dates: Date[]) => {
  return await prisma_next.dayOff.findMany({
    where: {
      scheduleId: scheduleId,
      date: {
        in: dates,
      },
    },
  });
};

export const filterNewDayOffsByIndex = async (
  scheduleId: string,
  daysOff: { name: string; date: Date; reason?: string }[]
) => {
  // Fetch all existing day-offs for the given scheduleId
  const existingDayOffs = await prisma_next.dayOff.findMany({
    where: {
      scheduleId: scheduleId,
    },
  });

  // Compare the lengths of existing day-offs and user-provided day-offs
  const existingLength = existingDayOffs.length;
  const newLength = daysOff.length;

  if (newLength <= existingLength) {
    return []; // No new entries
  }

  // Filter new day-offs by taking the difference in length
  const newDayOffs = daysOff.slice(existingLength);

  // Return the newly added day-offs
  return newDayOffs;
};
