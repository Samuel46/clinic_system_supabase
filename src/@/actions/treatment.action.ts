"use server";

import { Treatment } from "@prisma/client";
import {
  CreateTreatmentComponentInput,
  CreateTreatmentInput,
  UpdateTreatmentInput,
} from "@schemas/treament.schemas";
import {
  createTreatment,
  deleteEquipmentById,
  deleteTreatment,
  getAllTreatments,
  getTreatmentById,
  getTreatmentByName,
  updateTreatment,
  upsertEquipmentForTreatment,
} from "@services/treatment.service";

export const createTreatmentAction = async (
  data: CreateTreatmentInput
): Promise<{ success: boolean; data: Treatment | null; msg: string }> => {
  try {
    const existingTreatment = await getTreatmentByName(data.name);

    if (existingTreatment) {
      return { success: false, data: null, msg: "Treatment already exists!" };
    }

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

export const updateTreatmentAppointmentAction = async (
  treatmentId: string,
  data: UpdateTreatmentInput
): Promise<{ success: boolean; data: Treatment | null; msg: string }> => {
  try {
    const treatment = await updateTreatment(treatmentId, data);
    return {
      success: true,
      data: treatment,
      msg: "Treatment added to appointment successfully",
    };
  } catch (error: any) {
    console.error("Failed to update treatment:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed dded to appointment treatment",
    };
  }
};

export const upsertEquipmentToTreatmentAction = async (
  treatmentId: string,
  equipment: CreateTreatmentComponentInput[]
) => {
  try {
    await upsertEquipmentForTreatment(treatmentId, equipment);
    return {
      success: true,
      msg: "Treatment equipment added/updated successfully",
    };
  } catch (error: any) {
    console.error("Failed to add/update treatment equipment:", error);
    return {
      success: false,
      msg: error.message || "Failed to add/update treatment equipment",
    };
  }
};

export const deleteTreatmentEquipmentAction = async (
  id: string
): Promise<{ success: boolean; data: Treatment | null; msg: string }> => {
  try {
    await deleteEquipmentById(id);
    return { success: true, data: null, msg: "Treatment equipment deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete treatment:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete treatment equipment",
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
