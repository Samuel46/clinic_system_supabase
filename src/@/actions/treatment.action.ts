"use server";

import { Treatment } from "@prisma/client";
import { CreateTreatmentInput, UpdateTreatmentInput } from "@schemas/treament.schemas";
import {
  createTreatment,
  deleteTreatment,
  getAllTreatments,
  getTreatmentById,
  updateTreatment,
} from "@services/treatment.service";

export const createTreatmentAction = async (
  data: CreateTreatmentInput
): Promise<{ success: boolean; data: Treatment | null; msg: string }> => {
  try {
    const treatment = await createTreatment(data);
    return { success: true, data: treatment, msg: "Treatment created successfully" };
  } catch (error: any) {
    console.error("Failed to create treatment:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create treatment",
    };
  }
};

export const updateTreatmentAction = async (
  id: string,
  data: UpdateTreatmentInput
): Promise<{ success: boolean; data: Treatment | null; msg: string }> => {
  try {
    const treatment = await updateTreatment(id, data);
    return { success: true, data: treatment, msg: "Treatment updated successfully" };
  } catch (error: any) {
    console.error("Failed to update treatment:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update treatment",
    };
  }
};

export const deleteTreatmentAction = async (
  id: string
): Promise<{ success: boolean; data: Treatment | null; msg: string }> => {
  try {
    await deleteTreatment(id);
    return { success: true, data: null, msg: "Treatment deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete treatment:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete treatment",
    };
  }
};

export const getTreatmentByIdAction = async (
  id: string
): Promise<{ success: boolean; data: Treatment | null; msg: string }> => {
  try {
    const treatment = await getTreatmentById(id);
    if (!treatment) {
      return { success: false, data: null, msg: "Treatment not found" };
    }
    return { success: true, data: treatment, msg: "Treatment fetched successfully" };
  } catch (error: any) {
    console.error("Failed to get treatment:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to get treatment",
    };
  }
};

export const getAllTreatmentsAction = async (): Promise<{
  success: boolean;
  data: Treatment[] | null;
  msg: string;
}> => {
  try {
    const treatments = await getAllTreatments();
    return { success: true, data: treatments, msg: "Treatments fetched successfully" };
  } catch (error: any) {
    console.error("Failed to get treatments:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to get treatments",
    };
  }
};
