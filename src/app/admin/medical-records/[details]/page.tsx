import PatientRecordDetails from "@/components/patients/details/PatientRecordDetails";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import React from "react";

interface Props {
  params: {
    details: string;
  };
}

async function getData(id: string) {
  const record = await prisma_next.medicalRecord.findUnique({
    where: {
      id: id,
    },
    include: {
      doctor: true,
      treatments: true,
      checkups: true,
      patient: true,
    },
  });

  return { record };
}
export default async function PatientRecordPage({ params: { details: id } }: Props) {
  const { record } = await getData(id);

  const user = await getCurrentUser();

  return <PatientRecordDetails currentRecord={record} showPatient={false} user={user} />;
}
