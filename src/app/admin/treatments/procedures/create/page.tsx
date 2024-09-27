import { ProcedureForm } from "@/components/procedures";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

async function getData(id?: string) {
  let procedure;

  if (id) {
    procedure = await prisma_next.procedure.findUnique({
      where: {
        id,
      },
      include: {
        steps: true,
        equipment: true,
      },
    });
  }

  return { procedure };
}
export default async function CreateProcedurePage({ searchParams: { id } }: Props) {
  const user = await getCurrentUser();

  const { procedure } = await getData(id);

  return (
    <ProcedureForm user={user} currentProcedure={procedure} edit={Boolean(procedure)} />
  );
}
