import { PatientPrescriptionForm } from "@/components/patients/details/prescription";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import React from "react";

interface Props {
  searchParams: {
    id: string;
    prescriptionId: string;
  };
}

async function getData(id: string, prescriptionId: string) {
  const patient = await prisma_next.patient.findUnique({
    where: {
      id: id,
    },
  });

  let prescription;
  if (prescriptionId) {
    const currentPrescription = await prisma_next.prescription.findUnique({
      where: {
        id: prescriptionId,
      },
    });

    prescription = currentPrescription;
  }

  const medications = await prisma_next.medication.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return { patient, medications, prescription };
}
export default async function PatientRecordPage({
  searchParams: { id, prescriptionId },
}: Props) {
  const { patient, medications, prescription } = await getData(id, prescriptionId);
  const user = await getCurrentUser();

  return (
    <PatientPrescriptionForm
      patient={patient}
      medications={medications}
      user={user}
      currentPrescription={prescription}
    />
  );
}
