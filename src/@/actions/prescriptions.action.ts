"use server";

import {
  CreatePrescriptionInput,
  UpdatePrescriptionInput,
} from "@schemas/prescriptions.schemas";
import {
  createPrescription,
  deletePrescription,
  getPrescriptionById,
  updatePrescription,
} from "@services/prescriptions.service";

export const createPrescriptionAction = async (data: CreatePrescriptionInput) => {
  try {
    const prescription = await createPrescription(data);
    return {
      success: true,
      data: prescription,
      msg: "Prescription created successfully",
    };
  } catch (error: any) {
    console.error("Failed to create prescription:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create prescription",
    };
  }
};

export const updatePrescriptionAction = async (
  id: string,
  data: UpdatePrescriptionInput
) => {
  try {
    const currentPrescription = await getPrescriptionById(id);

    if (!currentPrescription) {
      return { success: false, msg: "Prescription not found" };
    }

    const hasChanges =
      currentPrescription.tenantId !== data.tenantId ||
      currentPrescription.patientId !== data.patientId ||
      currentPrescription.doctorId !== data.doctorId ||
      currentPrescription.medicationId !== data.medicationId ||
      currentPrescription.dosage !== data.dosage ||
      currentPrescription.frequency !== data.frequency ||
      currentPrescription.duration !== data.duration ||
      currentPrescription.instructions !== data.instructions;

    if (!hasChanges) {
      return { success: false, msg: "No changes detected" };
    }

    const updatedPrescription = await updatePrescription(id, data);
    return {
      success: true,
      data: updatedPrescription,
      msg: "Prescription updated successfully",
    };
  } catch (error: any) {
    console.error("Failed to update prescription:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update prescription",
    };
  }
};

export const deletePrescriptionAction = async (id: string) => {
  try {
    await deletePrescription(id);
    return { success: true, msg: "Prescription deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete prescription:", error);
    return { success: false, msg: error.message || "Failed to delete prescription" };
  }
};
