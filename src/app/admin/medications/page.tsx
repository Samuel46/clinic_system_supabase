import MedicationList from "@/components/medications/data-table";
import { medicationColumns } from "@/components/medications/data-table/columns";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { MedicationColumns } from "@type/index";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import React from "react";

async function getData() {
  const medications = await prisma_next.medication.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tenant: true,
    },
  });

  return { medications };
}

export default async function MedicationListPage() {
  const { medications } = await getData();
  const user = await getCurrentUser();

  const data = medications.map((item) => ({
    id: item.id,
    tenantName: item.tenant.name,
    name: item.name,
    description: item.description,
    price: item.price,
    unit: item.unit,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    role: user?.role,
  }));

  const filterableColumns = ["price", "tenantName", "unit"].map((key) => ({
    id: key,
    title: generateTitle(key),
    options: generateUniqueOptions(data, key as keyof MedicationColumns),
  }));

  return (
    <MedicationList
      columns={medicationColumns}
      data={data}
      filterableColumns={filterableColumns}
    />
  );
}
