import { PatientForm } from "@/components/patients";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";

import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

async function getData(id: string) {
  const patient = await prisma_next.patient.findUnique({
    where: {
      id: id,
    },
  });

  return { patient };
}

export default async function EditPatientPage({ searchParams: { id } }: Props) {
  const user = await getCurrentUser();

  const { patient } = await getData(id);

  return <PatientForm user={user} currentPatient={patient} edit />;
}
