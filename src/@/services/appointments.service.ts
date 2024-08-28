"use server";
import prisma_next from "@lib/db";
import { CreateAppointmentInput } from "@schemas/appointment.schemas";

export const createAppointment = async (data: CreateAppointmentInput) => {
  return await prisma_next.appointment.create({
    data,
  });
};

export const updateAppointment = async (
  appointmentId: string,
  data: CreateAppointmentInput
) => {
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

export const fetchAppointment = async (
  id: string,
  eventType: "INSERT" | "UPDATE" | "DELETE"
) => {
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
