"use server";

import { MedicalCheckup } from "@prisma/client";
import {
  CreateMedicalCheckupInput,
  UpdateMedicalCheckupInput,
} from "@schemas/checkup.schemas";
import {
  createMedicalCheckup,
  deleteMedicalCheckup,
  updateMedicalCheckup,
} from "@services/checkup.service";

export const createMedicalCheckupAction = async (
  data: CreateMedicalCheckupInput
): Promise<{ success: boolean; data: MedicalCheckup | null; msg: string }> => {
  try {
    const checkup = await createMedicalCheckup(data);
    return { success: true, data: checkup, msg: "Medical checkup created successfully" };
  } catch (error: any) {
    console.error("Failed to create medical checkup:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create medical checkup",
    };
  }
};

export const updateMedicalCheckupAction = async (
  id: string,
  data: UpdateMedicalCheckupInput
): Promise<{ success: boolean; data: MedicalCheckup | null; msg: string }> => {
  try {
    const checkup = await updateMedicalCheckup(id, data);
    return { success: true, data: checkup, msg: "Medical checkup updated successfully" };
  } catch (error: any) {
    console.error("Failed to update medical checkup:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update medical checkup",
    };
  }
};

export const deleteMedicalCheckupAction = async (
  id: string
): Promise<{ success: boolean; data: MedicalCheckup | null; msg: string }> => {
  try {
    await deleteMedicalCheckup(id);
    return { success: true, data: null, msg: "Medical checkup deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete medical checkup:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete medical checkup",
    };
  }
};
