import { MedicationForm } from "@/components/medications";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import React from "react";

interface Props {
  params: {
    edit: string;
  };
}

async function getData(id: string) {
  const medication = await prisma_next.medication.findUnique({
    where: { id },
  });

  return { medication };
}

export default async function CreateMedicationPage({ params: { edit: id } }: Props) {
  const { medication } = await getData(id);

  const user = await getCurrentUser();

  return <MedicationForm user={user} currentMedication={medication} edit />;
}
