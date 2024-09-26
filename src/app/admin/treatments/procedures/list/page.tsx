import { procedureColumns, ProcedureList } from "@/components/procedures";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { ProcedureColumns } from "@type/index";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import React from "react";

async function getData() {
  const procedures = await prisma_next.procedure.findMany({
    include: {
      steps: true,
      equipment: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return { procedures };
}
export default async function ProcedureListPage() {
  const { procedures } = await getData();
  const user = await getCurrentUser();

  const data = procedures.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description as string,
    steps: item.steps.length,
    equipment: item.equipment.length,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    role: user?.role,
  }));

  return <ProcedureList columns={procedureColumns} data={data} filterableColumns={[]} />;
}
