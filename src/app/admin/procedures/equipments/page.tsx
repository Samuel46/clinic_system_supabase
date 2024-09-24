import { EquipmentForm } from "@/components/procedures/equipments";
import prisma_next from "@lib/db";
import { Procedure } from "@prisma/client";
import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

async function getData(id: string) {
  const procedure = await prisma_next.procedure.findUnique({
    where: {
      id,
    },

    include: {
      equipment: true,
      steps: true,
    },
  });

  const equipments = await prisma_next.component.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return { procedure, equipments };
}

export default async function ProcedureEquipmentPage({ searchParams: { id } }: Props) {
  const { procedure, equipments } = await getData(id);

  console.log(procedure);

  return (
    <EquipmentForm
      edit={Boolean(procedure?.equipment.length)}
      currentEquipments={procedure?.equipment ?? []}
      currentProcedure={procedure as Procedure}
      currentSteps={procedure?.steps ?? []}
      equipments={equipments}
    />
  );
}
