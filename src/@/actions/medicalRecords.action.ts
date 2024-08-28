"use server";

import { MedicalRecord } from "@prisma/client";
import {
  CreateMedicalRecordInput,
  UpdateMedicalRecordInput,
} from "@schemas/medicalRecord.schemas";
import {
  createMedicalRecord,
  deleteMedicalRecord,
  updateMedicalRecord,
} from "@services/medicalRecords.service";

export const createMedicalRecordAction = async (
  data: CreateMedicalRecordInput
): Promise<{ success: boolean; data: MedicalRecord | null; msg: string }> => {
  try {
    const medicalRecord = await createMedicalRecord(data);
    return {
      success: true,
      data: medicalRecord,
      msg: "Medical record created successfully",
    };
  } catch (error: any) {
    console.error("Failed to create medical record:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create medical record",
    };
  }
};
export const updateMedicalRecordAction = async (
  id: string,
  data: UpdateMedicalRecordInput
): Promise<{ success: boolean; data: MedicalRecord | null; msg: string }> => {
  try {
    const medicalRecord = await updateMedicalRecord(id, data);
    return {
      success: true,
      data: medicalRecord,
      msg: "Medical record updated successfully",
    };
  } catch (error: any) {
    console.error("Failed to update medical record:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update medical record",
    };
  }
};

export const deleteMedicalRecordAction = async (
  id: string
): Promise<{ success: boolean; data: MedicalRecord | null; msg: string }> => {
  try {
    await deleteMedicalRecord(id);
    return { success: true, data: null, msg: "Medical record deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete medical record:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete medical record",
    };
  }
};
