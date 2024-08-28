import { SaleForm } from "@/components/sales";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import React from "react";

interface Props {
  params: {
    edit: string;
  };
}

async function getData(id: string) {
  const medications = await prisma_next.medication.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tenant: true,
    },
  });
  const sale = await prisma_next.sale.findUnique({
    where: {
      id: id,
    },
    include: {
      items: true,
    },
  });

  return { sale, medications };
}

export default async function EditSalePage({ params: { edit: id } }: Props) {
  const user = await getCurrentUser();

  const { sale, medications } = await getData(id);

  return <SaleForm user={user} currentSale={sale} medications={medications} edit />;
}
