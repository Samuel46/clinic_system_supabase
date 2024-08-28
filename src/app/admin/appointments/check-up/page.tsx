import MedicalCheckupForm from "@/components/appointments/check-up/MedicalCheckupForm";
import AppointmentSteps from "@/components/appointments/details/AppointmentSteps";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

async function getData(id: string) {
  const appointment = await prisma_next.appointment.findUnique({
    where: {
      id,
    },

    include: {
      medicalCheckup: true,
      treatment: true,
      medicalRecord: true,
    },
  });

  return { appointment };
}
export default async function CheckUpPage({ searchParams: { id } }: Props) {
  const user = await getCurrentUser();

  const { appointment } = await getData(id);

  return (
    <MedicalCheckupForm
      user={user}
      appointment={appointment}
      currentCheckup={appointment?.medicalCheckup}
      treatment={appointment?.treatment}
      record={appointment?.medicalRecord}
    />
  );
}
