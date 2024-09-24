import { StepForm } from "@/components/procedures/steps";
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
      steps: true,
      equipment: true,
    },
  });

  return { procedure };
}

export default async function ProcedureStepsPage({ searchParams: { id } }: Props) {
  const { procedure } = await getData(id);

  return (
    <StepForm
      edit={Boolean(procedure?.steps.length)}
      currentProcedure={procedure as Procedure}
      currentSteps={procedure?.steps ?? []}
      currentEquipments={procedure?.equipment ?? []}
    />
  );
}
