import { ProcedureForm } from "@/components/procedures";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

async function getData(id: string) {
  const procedure = await prisma_next.procedure.findUnique({
    where: {
      id: id,
    },
    include: {
      steps: true,
      equipment: true,
    },
  });

  return { procedure };
}
export default async function EditProcedurePage({ searchParams: { id } }: Props) {
  const user = await getCurrentUser();

  const { procedure } = await getData(id);

  return (
    <ProcedureForm user={user} currentProcedure={procedure} edit={Boolean(procedure)} />
  );
}
