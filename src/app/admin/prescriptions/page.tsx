import { inventoryColumns } from "@/components/inventory/data-table/columns";
import { PrescriptionList } from "@/components/prescriptions";
import { prescriptionColumns } from "@/components/prescriptions/data-table/columns";

import prisma_next from "@lib/db";
import { PrescriptionColumns } from "@type/index";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import React from "react";

async function getData() {
  const prescriptions = await prisma_next.prescription.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tenant: true,
      medication: true,
      patient: true,
      doctor: true,
    },
  });

  return { prescriptions };
}

export default async function InventoryListPage() {
  const { prescriptions } = await getData();

  const data: PrescriptionColumns[] = prescriptions.map((item) => ({
    id: item.id,
    tenantName: item.tenant.name,
    patientName: item.patient.name,
    doctorName: item.doctor.name,
    medicationName: item.medication.name,
    dosage: item.dosage,
    frequency: item.frequency,
    duration: item.duration,
    instructions: item.instructions || "",
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  const filterableColumns = ["doctorName", "dosage", "frequency", "createdAt"].map(
    (key) => ({
      id: key,
      title: generateTitle(key),
      options: generateUniqueOptions(data, key as keyof PrescriptionColumns),
    })
  );

  return (
    <PrescriptionList
      columns={prescriptionColumns}
      data={data}
      filterableColumns={filterableColumns}
    />
  );
}
