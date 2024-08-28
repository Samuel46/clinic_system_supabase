import { InventoryForm } from "@/components/inventory";
import prisma_next from "@lib/db";

import { getCurrentUser } from "@lib/session";
import React from "react";

async function getData() {
  const medications = await prisma_next.medication.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return { medications };
}

export default async function CreateMedicationPage() {
  const user = await getCurrentUser();

  const { medications } = await getData();

  return <InventoryForm user={user} medications={medications} />;
}
