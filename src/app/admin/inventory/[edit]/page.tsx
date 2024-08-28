import { InventoryForm } from "@/components/inventory";
import prisma_next from "@lib/db";

import { getCurrentUser } from "@lib/session";
import React from "react";

interface Props {
  params: {
    edit: string;
  };
}

async function getData(id: string) {
  const inventory = await prisma_next.inventory.findUnique({
    where: { id },
  });
  const medications = await prisma_next.medication.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return { medications, inventory };
}

export default async function CreateMedicationPage({ params: { edit: id } }: Props) {
  const user = await getCurrentUser();

  const { medications, inventory } = await getData(id);

  return (
    <InventoryForm
      user={user}
      medications={medications}
      currentInventory={inventory}
      edit
    />
  );
}
