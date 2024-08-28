"use server";

import {
  CreateMedicationInput,
  UpdateMedicationInput,
} from "@schemas/medications.schemas";
import {
  createMedication,
  createSampleMedications,
  deleteMedication,
  getAllMedications,
  getMedicationById,
  updateMedication,
} from "@services/medications.service";

export const createMedicationAction = async (data: CreateMedicationInput) => {
  try {
    const medication = await createMedication(data);
    return { success: true, data: medication, msg: "Medication created successfully" };
  } catch (error: any) {
    console.error("Failed to create medication:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create medication",
    };
  }
};

export const createMedicationSampleAction = async () => {
  try {
    const medication = await createSampleMedications();
    return {
      success: true,
      data: medication,
      msg: "Medication samples created successfully",
    };
  } catch (error: any) {
    console.error("Failed to create medication:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create medication samples",
    };
  }
};

export const updateMedicationAction = async (id: string, data: UpdateMedicationInput) => {
  try {
    const currentMedication = await getMedicationById(id);

    if (!currentMedication) {
      return { success: false, msg: "Medication not found" };
    }

    const hasChanges =
      currentMedication.tenantId !== data.tenantId ||
      currentMedication.name !== data.name ||
      currentMedication.description !== data.description ||
      currentMedication.price !== data.price ||
      currentMedication.unit !== data.unit;
    if (!hasChanges) {
      return { success: false, msg: "No changes detected" };
    }

    const updatedMedication = await updateMedication(id, data);
    return {
      success: true,
      data: updatedMedication,
      msg: "Medication updated successfully",
    };
  } catch (error: any) {
    console.error("Failed to update medication:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update medication",
    };
  }
};

export const getMedicationByIdAction = async (id: string) => {
  try {
    const medication = await getMedicationById(id);
    if (!medication) {
      return { success: false, msg: "Medication not found" };
    }
    return { success: true, data: medication };
  } catch (error: any) {
    console.error("Failed to get medication:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to get medication",
    };
  }
};

export const getAllMedicationsAction = async (tenantId: string) => {
  try {
    const medications = await getAllMedications(tenantId);
    return { success: true, data: medications };
  } catch (error: any) {
    console.error("Failed to get medications:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to get medications",
    };
  }
};

export const deleteMedicationAction = async (id: string) => {
  try {
    const currentMedication = await getMedicationById(id);

    if (!currentMedication) {
      return { success: false, msg: "Medication not found" };
    }

    await deleteMedication(id);
    return { success: true, msg: "Medication deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete medication:", error);
    return {
      success: false,
      msg: error.message || "Failed to delete medication",
    };
  }
};
