import MedicalRecordList from "@/components/medicalRecord/data-table";
import { medicalRecordColumns } from "@/components/medicalRecord/data-table/columns";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";

import { MedicalRecordColumns, SessionUser } from "@type/index";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import React from "react";

async function getData(user?: SessionUser) {
  const whereClause = user?.role !== "Admin" ? { tenantId: user?.tenantId } : {};

  const records = await prisma_next.medicalRecord.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: whereClause,
    include: {
      patient: true,
      treatments: true,
      checkups: true,
      doctor: true,
      tenant: true,
    },
  });

  return { records };
}
export default async function CreateMedicalRecord() {
  const user = await getCurrentUser();
  const { records } = await getData(user);

  const data = records.map((item) => ({
    id: item.id,
    patient: item.patient.name,
    doctor: item.doctor.name,
    checkup: item.checkups,
    treatment: item.treatments,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    role: user?.role,
  }));

  const filterableColumns = ["doctor", "patient"].map((key) => ({
    id: key,
    title: generateTitle(key),
    options: generateUniqueOptions(data, key as keyof MedicalRecordColumns),
  }));
  return (
    <MedicalRecordList
      columns={medicalRecordColumns}
      data={data}
      filterableColumns={filterableColumns}
    />
  );
}
