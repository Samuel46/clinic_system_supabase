"use server";
import { Appointment } from "@prisma/client";
import {
  CreateAppointmentInput,
  UpdateAppointmentStatusInput,
} from "@schemas/appointment.schemas";
import {
  createAppointment,
  deleteAppointment,
  updateAppointment,
  updateAppointmentStatus,
} from "@services/appointments.service";
import { revalidatePath } from "next/cache";

export const createAppointmentAction = async (
  data: CreateAppointmentInput
): Promise<{ success: boolean; data: Appointment | null; msg: string }> => {
  try {
    const appointment = await createAppointment(data);
    revalidatePath("/admin/appointments");
    return { success: true, data: appointment, msg: "Appointment created successfully" };
  } catch (error: any) {
    console.error("Failed to create appointment:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create appointment",
    };
  }
};

export const updateAppointmentStatusAction = async (
  data: UpdateAppointmentStatusInput
): Promise<{ success: boolean; data: Appointment | null; msg: string }> => {
  try {
    const { id, status } = data;
    const updatedAppointment = await updateAppointmentStatus(id, status);

    revalidatePath("/admin/appointments");
    return {
      success: true,
      data: updatedAppointment,
      msg: "Appointment status updated to completed successfully.",
    };
  } catch (error: any) {
    console.error("Failed to update appointment status:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update appointment status",
    };
  }
};

export const updateAppointmentAction = async (
  appointmentId: string,
  data: CreateAppointmentInput
): Promise<{ success: boolean; data: Appointment | null; msg: string }> => {
  try {
    const appointment = await updateAppointment(appointmentId, data);
    if (!appointment) {
      return {
        success: false,
        data: null,
        msg: "Appointment not found or no changes detected",
      };
    }
    revalidatePath("/admin/appointments");
    return { success: true, data: appointment, msg: "Appointment updated successfully" };
  } catch (error: any) {
    console.error("Failed to update appointment:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update appointment",
    };
  }
};

export const deleteAppointmentAction = async (
  appointmentId: string
): Promise<{ success: boolean; data: Appointment | null; msg: string }> => {
  try {
    const appointment = await deleteAppointment(appointmentId);
    if (!appointment) {
      return { success: false, data: null, msg: "Appointment not found" };
    }
    revalidatePath("/admin/appointments");
    return { success: true, data: appointment, msg: "Appointment deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete appointment:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete appointment",
    };
  }
};
