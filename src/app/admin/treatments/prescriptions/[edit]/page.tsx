import { PrescriptionForm } from "@/components/prescriptions";
import prisma_next from "@lib/db";

import { getCurrentUser } from "@lib/session";
import React from "react";

interface Props {
  params: {
    edit: string;
  };
}

async function getData(id: string) {
  const prescription = await prisma_next.prescription.findUnique({
    where: {
      id,
    },
  });
  const medications = await prisma_next.medication.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const patients = await prisma_next.patient.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return { medications, patients, prescription };
}

export default async function EditPrescriptionPage({ params: { edit: id } }: Props) {
  const user = await getCurrentUser();

  const { medications, patients, prescription } = await getData(id);

  return (
    <PrescriptionForm
      user={user}
      medications={medications}
      patients={patients}
      currentPrescription={prescription}
      edit
    />
  );
}
