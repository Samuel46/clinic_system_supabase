import { PrescriptionForm } from "@/components/prescriptions";
import prisma_next from "@lib/db";

import { getCurrentUser } from "@lib/session";
import React from "react";

async function getData() {
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

  return { medications, patients };
}

export default async function CreatePrescriptionPage() {
  const user = await getCurrentUser();

  const { medications, patients } = await getData();

  return <PrescriptionForm user={user} medications={medications} patients={patients} />;
}
