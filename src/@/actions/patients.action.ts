"use server";
import { getCurrentUser } from "@lib/session";
import { Patient } from "@prisma/client";
import { CreatePatientInput } from "@schemas/patients.schemas";
import {
  createPatient,
  deletePatient,
  getPatientByEmail,
  updatePatient,
} from "@services/patients.service";
import { revalidatePath } from "next/cache";

export async function createPatientAction(
  data: CreatePatientInput
): Promise<{ success: boolean; data: Patient | null; msg: string }> {
  try {
    const user = await getCurrentUser();

    const existingPatient = await getPatientByEmail(data.email, user?.tenantId ?? "");

    if (existingPatient) {
      return { success: false, data: null, msg: "Patient already exist!" };
    }

    const patient = await createPatient(data);
    revalidatePath("/admin/patients");
    return { success: true, data: patient, msg: "Patient created successfully" };
  } catch (error: any) {
    console.error("Failed to create patient:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create patient",
    };
  }
}

export async function updatePatientAction(
  id: string,
  data: Partial<CreatePatientInput>
): Promise<{ success: boolean; data: Patient | null; msg: string }> {
  try {
    const patient = await updatePatient(id, data);
    if (!patient) {
      return { success: false, data: null, msg: "Patient not found" };
    }
    revalidatePath("/admin/patients");
    return { success: true, data: patient, msg: "Patient updated successfully" };
  } catch (error: any) {
    console.error("Failed to update patient:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update patient",
    };
  }
}

export async function deletePatientAction(
  id: string
): Promise<{ success: boolean; data: Patient | null; msg: string }> {
  try {
    const patient = await deletePatient(id);
    revalidatePath("/admin/patients");
    return { success: true, data: patient, msg: "Patient deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete patient:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete patient",
    };
  }
}
