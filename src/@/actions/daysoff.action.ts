"use server";
import { DayOff, Schedule } from "@prisma/client";
import { CreateScheduleInput } from "@schemas/schedule.schemas";

import {
  deleteDayOff,
  filterNewDayOffsByIndex,
  findExistingDayOffs,
} from "@services/dayoffs.service";
import { createDaysOffInvite } from "@services/schedules.service";

export const createDayOffAction = async (
  data: CreateScheduleInput,
  id: string
): Promise<{ success: boolean; data: Schedule | null; msg: string }> => {
  try {
    // Check if daysOff array is provided
    if (!data.daysOff || data.daysOff.length === 0) {
      return {
        success: false,
        data: null,
        msg: "No day off data provided",
      };
    }

    // Extract new dayoffs from the user input
    const newDayOffs = await filterNewDayOffsByIndex(id, data.daysOff);

    // Extract dates and check for existing day-offs
    const dates = newDayOffs.map((dayOff) => dayOff.date);

    const existingDayOffs = await findExistingDayOffs(id, dates);

    if (existingDayOffs.length > 0) {
      const existingDates = existingDayOffs
        .map((dayOff) => dayOff.date.toDateString())
        .join(", ");
      return {
        success: false,
        data: null,
        msg: `Day off(s) already exist for the following date(s): ${existingDates}.`,
      };
    }

    const dayOff = await createDaysOffInvite(id, data?.daysOff ?? []);

    return { success: true, data: dayOff, msg: "DayOff created successfully" };
  } catch (error: any) {
    console.error("Failed to create DayOff:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create DayOff",
    };
  }
};

export const updateDayOffAction = async (
  id: string,
  data: CreateScheduleInput
): Promise<{ success: boolean; data: Schedule | null; msg: string }> => {
  try {
    // Check if daysOff array is provided
    if (!data.daysOff || data.daysOff.length === 0) {
      return {
        success: false,
        data: null,
        msg: "No day off data provided",
      };
    }
    // Extract new dayoffs from the user input
    const newDayOffs = await filterNewDayOffsByIndex(id, data.daysOff);

    const dates = newDayOffs.map((dayOff) => dayOff.date);

    const existingDayOffs = await findExistingDayOffs(id, dates);

    if (existingDayOffs.length > 0) {
      const existingDates = existingDayOffs
        .map((dayOff) => dayOff.date.toDateString())
        .join(", ");
      return {
        success: false,
        data: null,
        msg: `Day off(s) already exist for the following date(s): ${existingDates}.`,
      };
    }

    const dayOff = await createDaysOffInvite(id, data?.daysOff ?? []);

    return { success: true, data: dayOff, msg: "DayOff updated successfully" };
  } catch (error: any) {
    console.error("Failed to update DayOff:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update DayOff",
    };
  }
};

export const deleteDayOffAction = async (
  id: string
): Promise<{ success: boolean; data: DayOff | null; msg: string }> => {
  try {
    const dayOff = await deleteDayOff(id);

    return { success: true, data: dayOff, msg: "DayOff deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete DayOff:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete DayOff",
    };
  }
};
