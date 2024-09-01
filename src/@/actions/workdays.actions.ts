"use server";

import { Schedule, WorkDay } from "@prisma/client";
import { CreateScheduleInput, UpdateScheduleInput } from "@schemas/schedule.schemas";
import { createWorkDayInvite } from "@services/schedules.service";
import {
  deleteWorkDay,
  filterNewAndUpdatedWorkDaysByIndex,
  filterNewWorkDaysByIndex,
  getWorkDayByDaySchedule,
} from "@services/workdays.service";

export const createWorkDayAction = async (
  data: CreateScheduleInput,
  scheduleId: string
): Promise<{ success: boolean; data: Schedule | null; msg: string }> => {
  try {
    // Check if daysOff array is provided
    if (!data.workDays || data.workDays.length === 0) {
      return {
        success: false,
        data: null,
        msg: "No day off data provided",
      };
    }

    // Extract new dayoffs from the user input
    const newWorkDays = await filterNewWorkDaysByIndex(scheduleId, data.workDays);

    for (const dayOffInput of newWorkDays) {
      const existingDayOff = await getWorkDayByDaySchedule(dayOffInput.day, scheduleId);

      if (existingDayOff) {
        return {
          success: false,
          data: null,
          msg: `Work day ${dayOffInput.day} already exists.`,
        };
      }
    }
    // Directly call the service function
    const workDay = await createWorkDayInvite(scheduleId, data.workDays);

    return { success: true, data: workDay, msg: "WorkDay created successfully" };
  } catch (error: any) {
    console.error("Failed to create WorkDay:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create WorkDay",
    };
  }
};

export const updateWorkDayAction = async (
  id: string,
  data: CreateScheduleInput
): Promise<{ success: boolean; data: Schedule | null; msg: string }> => {
  try {
    // Check if daysOff array is provided
    if (!data.workDays || data.workDays.length === 0) {
      return {
        success: false,
        data: null,
        msg: "No day off data provided",
      };
    }

    // Extract new dayoffs from the user input
    // const newWorkDays = await filterNewWorkDaysByIndex(id, data.workDays);

    const { updatedWorkDays, newWorkDays } = await filterNewAndUpdatedWorkDaysByIndex(
      id,
      data.workDays
    );

    console.log(updatedWorkDays, "updated!!!", newWorkDays);

    // TODO: find a way to optimize only handle new entries and the updated entries instead or recreating each time

    for (const dayOffInput of newWorkDays) {
      const existingDayOff = await getWorkDayByDaySchedule(dayOffInput.day, id);

      if (existingDayOff) {
        return {
          success: false,
          data: null,
          msg: `Work day ${dayOffInput.day} already exists.`,
        };
      }
    }
    // Directly call the service function
    const workDay = await createWorkDayInvite(id, data.workDays);

    return { success: true, data: workDay, msg: "WorkDay updated successfully" };
  } catch (error: any) {
    console.error("Failed to update WorkDay:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update WorkDay",
    };
  }
};

export const deleteWorkDayAction = async (
  id: string
): Promise<{ success: boolean; data: WorkDay | null; msg: string }> => {
  try {
    // Directly call the service function
    const workDay = await deleteWorkDay(id);

    return { success: true, data: workDay, msg: "WorkDay deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete WorkDay:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete WorkDay",
    };
  }
};
