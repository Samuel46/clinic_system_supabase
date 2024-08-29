import { AppointDetails, AppointmentForm } from "@/components/appointments";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import React from "react";

interface Props {
  params: {
    detail: string;
  };
}

async function getData(id: string) {
  const appointment = await prisma_next.appointment.findUnique({
    where: {
      id,
    },

    include: {
      patient: true,
      doctor: true,
      medicalCheckup: true,
      treatment: true,
      medicalRecord: true,
    },
  });
  const patients = await prisma_next.patient.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return { appointment, patients };
}
export default async function EditAppointmentPage({ params: { detail: id } }: Props) {
  const user = await getCurrentUser();

  const { patients, appointment } = await getData(id);
  return <AppointDetails appointment={appointment} user={user} />;
}
