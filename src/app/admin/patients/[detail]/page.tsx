import { PatientDetails } from "@/components/patients";

import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";

import React from "react";

interface Props {
  params: {
    detail: string;
  };
}

async function getData(id: string) {
  const patient = await prisma_next.patient.findUnique({
    where: {
      id: id,
    },
  });

  const billings = await prisma_next.billing.findMany({
    where: {
      patientId: id,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const appointments = await prisma_next.appointment.findMany({
    where: {
      patientId: id,
    },

    orderBy: {
      createdAt: "desc",
    },
    include: {
      doctor: true,
      medicalRecord: {
        include: {
          treatments: true,
          checkups: true,
        },
      },
    },
  });

  const medicalRecord = await prisma_next.medicalRecord.findMany({
    where: {
      patientId: id,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      treatments: true,
      checkups: true,
      doctor: true,
    },
  });

  const prescriptions = await prisma_next.prescription.findMany({
    where: {
      patientId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      medication: true,
    },
  });

  return { patient, billings, appointments, prescriptions, medicalRecord };
}

export default async function EditPatientPage({ params: { detail: id } }: Props) {
  const user = await getCurrentUser();
  const { patient, billings, appointments, prescriptions, medicalRecord } = await getData(
    id
  );

  return (
    <PatientDetails
      id={id}
      patient={patient}
      bills={billings}
      appointments={appointments}
      prescriptions={prescriptions}
      medicalRecord={medicalRecord}
      user={user}
    />
  );
}
