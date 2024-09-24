"use server";
import { revalidatePath } from "next/cache";

import { Appointment } from "@prisma/client";
import {
	CreateAppointmentInput,
	UpdateAppointmentStatusInput,
	UpsertTreatmentToAppointmentInput,
} from "@schemas/appointment.schemas";
import { CreateTreatmentInput } from "@schemas/treament.schemas";
import {
	createAppointment,
	deleteAppointment,
	removeTreatmentFromAppointment,
	updateAppointment,
	updateAppointmentStatus,
	upsertTreatmentForAppointment,
} from "@services/appointments.service";

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

export const removeTreatmentFromAppointmentAction = async (
	appointmentId: string,
	treatmentId: string
): Promise<{ success: boolean; data: Appointment | null; msg: string }> => {
	try {
		await removeTreatmentFromAppointment(appointmentId, treatmentId);
		revalidatePath("/admin/appointments");
		return {
			success: true,
			data: null,
			msg: "Treatment removed from appointment.",
		};
	} catch (error: any) {
		console.error("Failed to remove treatment from appointment:", error);
		return {
			success: false,
			data: null,
			msg: error.message || "Failed to remove treatment from appointment",
		};
	}
};

export const upsertTreatmentForAppointmentAction = async (
	appointmentId: string,
	treatments: CreateTreatmentInput[]
): Promise<{ success: boolean; data: Appointment | null; msg: string }> => {
	try {
		await upsertTreatmentForAppointment(appointmentId, treatments);

		return {
			success: true,
			data: null,
			msg: "Treatment add/update to appointment.",
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
