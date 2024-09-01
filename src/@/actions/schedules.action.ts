"use server";

import { Schedule } from "@prisma/client";
import { CreateScheduleInput, UpdateScheduleInput } from "@schemas/schedule.schemas";

import {
  createSchedule,
  deleteSchedule,
  getScheduleById,
} from "@services/schedules.service";

export const createScheduleAction = async (
  data: CreateScheduleInput
): Promise<{ success: boolean; data: Schedule | null; msg: string }> => {
  try {
    const schedule = await createSchedule(data);

    return { success: true, data: schedule, msg: "Schedule created successfully" };
  } catch (error: any) {
    console.error("Failed to create schedule:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create schedule",
    };
  }
};

export const getScheduleByIdAction = async (
  id: string
): Promise<{ success: boolean; data: Schedule | null; msg: string }> => {
  try {
    const schedule = await getScheduleById(id);
    if (!schedule) {
      return { success: false, data: null, msg: "Schedule not found" };
    }

    return { success: true, data: schedule, msg: "Schedule retrieved successfully" };
  } catch (error: any) {
    console.error("Failed to retrieve schedule:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to retrieve schedule",
    };
  }
};

// export const updateScheduleAction = async (
//   id: string,
//   data: UpdateScheduleInput
// ): Promise<{ success: boolean; data: Schedule | null; msg: string }> => {
//   try {
//     const schedule = await updateSchedule(id, data);

//     return { success: true, data: schedule, msg: "Schedule updated successfully" };
//   } catch (error: any) {
//     console.error("Failed to update schedule:", error);
//     return {
//       success: false,
//       data: null,
//       msg: error.message || "Failed to update schedule",
//     };
//   }
// };

export const deleteScheduleAction = async (
  id: string
): Promise<{ success: boolean; data: null; msg: string }> => {
  try {
    await deleteSchedule(id);

    return { success: true, data: null, msg: "Schedule deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete schedule:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete schedule",
    };
  }
};
