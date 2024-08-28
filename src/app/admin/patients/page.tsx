import PatientList from "@/components/patients/data-table";
import { patientColumns } from "@/components/patients/data-table/columns";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";

import { PatientColumns, SessionUser } from "@type/index";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import React from "react";

async function getData(user?: SessionUser) {
  const whereClause = user?.role !== "Admin" ? { tenantId: user?.tenantId } : {};

  const patients = await prisma_next.patient.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: whereClause,
    include: {
      tenant: true,
    },
  });

  return { patients };
}
export default async function PatientListPage() {
  const user = await getCurrentUser();

  const { patients } = await getData(user);

  const data = patients.map((item) => ({
    id: item.id,
    email: item.email,
    name: item.name,
    address: item.address,
    tenantName: item.tenant.name,
    phone: item.phone,
    dateOfBirth: item.dateOfBirth,
    medicalHistory: item.medicalHistory,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    role: user?.role,
  }));

  const filterableColumns = ["address", "email", "dateOfBirth", "phone"].map((key) => ({
    id: key,
    title: generateTitle(key),
    options: generateUniqueOptions(data, key as keyof PatientColumns),
  }));
  return (
    <div>
      <PatientList
        data={data}
        filterableColumns={filterableColumns}
        columns={patientColumns}
      />
    </div>
  );
}
