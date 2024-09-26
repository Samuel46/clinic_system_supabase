import { AddProcedureForm } from "@/components/treatment/addProcedure";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

async function getData(id: string) {
  const treatment = await prisma_next.treatment.findUnique({
    where: {
      id,
    },

    include: {
      procedure: true,
    },
  });

  const procedures = await prisma_next.procedure.findMany({
    orderBy: { createdAt: "desc" },
  });

  return { treatment, procedures };
}

export default async function AddProcedurePage({ searchParams: { id } }: Props) {
  const { procedures, treatment } = await getData(id);
  const user = await getCurrentUser();

  return (
    <AddProcedureForm currentTreatment={treatment} procedures={procedures} user={user} />
  );
}
