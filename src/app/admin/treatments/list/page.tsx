import TreatmentList from "@/components/treatment/data-table";
import { treatmentColumns } from "@/components/treatment/data-table/treatmentColumns";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import React from "react";

async function getData() {
  const treatments = await prisma_next.treatment.findMany({
    include: {
      treatmentEquipments: true,
      procedure: true,
      doctor: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return { treatments };
}

export default async function TreatmentListPage() {
  const { treatments } = await getData();
  const user = await getCurrentUser();

  const data = treatments.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description as string,
    type: item.type,
    doctor: item.doctor.name,
    procedure: item.procedure?.name as string,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    role: user?.role,
  }));
  return <TreatmentList filterableColumns={[]} columns={treatmentColumns} data={data} />;
}
