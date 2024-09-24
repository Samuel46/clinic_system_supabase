"use server";
import prisma_next from "@lib/db";
import { CreateAppointmentInput } from "@schemas/appointment.schemas";
import { CreateTreatmentInput } from "@schemas/treament.schemas";

export const createAppointment = async (data: CreateAppointmentInput) => {
	return await prisma_next.appointment.create({
		data,
	});
};

export const updateAppointment = async (appointmentId: string, data: CreateAppointmentInput) => {
	return await prisma_next.$transaction(async (tx) => {
		const currentAppointment = await tx.appointment.findUnique({
			where: { id: appointmentId },
		});

		if (!currentAppointment) {
			return null;
		}

		const hasChanges =
			data.date !== currentAppointment.date ||
			data.startTime !== currentAppointment.startTime ||
			data.endTime !== currentAppointment.endTime ||
			data.reason !== currentAppointment.reason ||
			data.status !== currentAppointment.status;

		if (!hasChanges) {
			return currentAppointment;
		}

		const updatedAppointment = await tx.appointment.update({
			where: { id: appointmentId },
			data,
		});

		return updatedAppointment;
	});
};

export const upsertTreatmentForAppointment = async (appointmentId: string, treatments: CreateTreatmentInput[]): Promise<void> => {
	await prisma_next.$transaction(async (prisma) => {
		// Fetch existing treatments for the appointment
		const existingTreatments = await prisma.treatment.findMany({
			where: { appointmentId },
		});

		// Map for fast lookup
		const existingTreatmentMap = new Map(existingTreatments.map((treatment) => [treatment.name, treatment]));

		const treatmentsToAddToAppointment = [];
		const treatmentsToUpdate = [];

		for (const treatment of treatments) {
			const existingTreatment = existingTreatmentMap.get(treatment.name);
			if (!existingTreatment) {
				// New treatment to create
				treatmentsToAddToAppointment.push({
					appointmentId,

					...treatment,
				});
			} else if (existingTreatment.type !== treatment.type || existingTreatment.description !== treatment.description) {
				// Update if the type or description differs
				treatmentsToUpdate.push({
					id: existingTreatment.id,
					type: treatment.type,
					description: treatment.description,
				});
			}
		}
		console.log(treatmentsToAddToAppointment, "create");
		console.log(treatmentsToUpdate, "Update");

		// Links existing treatments to the appointment by connecting their IDs
		if (treatmentsToAddToAppointment.length > 0) {
			await prisma.appointment.update({
				where: { id: appointmentId },
				data: {
					treatment: {
						connect: treatmentsToAddToAppointment.map((treatment) => ({ id: treatment.id })),
					},
				},
			});
		}

		// Bulk update modified treatments
		if (treatmentsToUpdate.length > 0) {
			await Promise.all(
				treatmentsToUpdate.map((treatment) =>
					prisma.treatment.update({
						where: {
							id: treatment.id,
						},
						data: {
							type: treatment.type,
							description: treatment.description,
						},
					})
				)
			);
		}
	});
};

// fn: that removes the treatment from the appointment
export const removeTreatmentFromAppointment = async (appointmentId: string, treatmentId: string) => {
	return await prisma_next.appointment.update({
		where: { id: appointmentId },
		data: {
			treatment: {
				disconnect: { id: treatmentId },
			},
		},
	});
};
export const updateAppointmentStatus = async (id: string, status: "COMPLETED") => {
	const updatedAppointment = await prisma_next.appointment.update({
		where: { id },
		data: { status },
	});
	return updatedAppointment;
};

export const deleteAppointment = async (appointmentId: string) => {
	return await prisma_next.$transaction(async (tx) => {
		const appointment = await tx.appointment.findUnique({
			where: { id: appointmentId },
		});

		if (!appointment) {
			return null;
		}

		await tx.appointment.delete({
			where: { id: appointmentId },
		});

		return appointment;
	});
};

export const fetchAppointment = async (id: string, eventType: "INSERT" | "UPDATE" | "DELETE") => {
	if (eventType === "DELETE") return null;
	else {
		return await prisma_next.appointment.findUnique({
			where: { id },
			include: {
				doctor: true,
				patient: true,
			},
		});
	}
};
