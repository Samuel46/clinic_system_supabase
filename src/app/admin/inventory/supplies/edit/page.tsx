import { SuppliesForm } from "@/components/supplies";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";

import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

async function getData(id: string) {
  const supply = await prisma_next.component.findUnique({
    where: {
      id,
    },
  });

  return { supply };
}
export default async function SuppliesPage({ searchParams: { id } }: Props) {
  const user = await getCurrentUser();

  const { supply } = await getData(id);

  return <SuppliesForm user={user} edit={true} currentComponent={supply} />;
}
