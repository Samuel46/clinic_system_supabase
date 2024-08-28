import PatientRecordDetails from "@/components/patients/details/PatientRecordDetails";
import prisma_next from "@lib/db";
import React from "react";

interface Props {
  searchParams: {
    id: string;
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
export default async function PatientRecordPage({ searchParams: { id } }: Props) {
  const { record } = await getData(id);

  return <PatientRecordDetails currentRecord={record} />;
}
