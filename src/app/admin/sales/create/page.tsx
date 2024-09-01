import { SaleForm } from "@/components/sales";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";

import { Sale } from "@prisma/client";
import React from "react";

async function getData(id: string) {
  const inventory = await prisma_next.inventory.findMany({
    where: {
      tenantId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tenant: true,
      medication: true,
    },
  });

  return { inventory };
}

export default async function CreateSalePage() {
  const user = await getCurrentUser();

  const { inventory } = await getData(user?.tenantId!);

  const medications = inventory.map((item) => item.medication);

  return <SaleForm user={user} medications={medications} />;
}
