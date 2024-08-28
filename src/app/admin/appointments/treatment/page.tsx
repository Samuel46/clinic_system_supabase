import { TreatmentForm } from "@/components/appointments/treatment";
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
export default async function TreatmentPage({ searchParams: { id } }: Props) {
  const user = await getCurrentUser();

  const { appointment } = await getData(id);

  return (
    <TreatmentForm
      user={user}
      appointment={appointment}
      currentTreatment={appointment?.treatment}
      currentCheckup={appointment?.medicalCheckup}
      currentMedicalRecord={appointment?.medicalRecord}
    />
  );
}
