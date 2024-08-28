import { SaleDetails } from "@/components/sales";
import prisma_next from "@lib/db";
import React from "react";
interface Props {
  searchParams: {
    sale: string;
    warning: string;
    success: string;
  };
}

async function getData(id: string) {
  const sale = await prisma_next.sale.findUnique({
    where: {
      id: id,
    },
    include: {
      items: {
        include: {
          medication: true,
        },
      },
    },
  });

  return { sale };
}
export default async function SaleDetailsPage({
  searchParams: { sale: saleId, warning, success },
}: Props) {
  const { sale } = await getData(saleId);

  return <SaleDetails sale={sale} warning={warning} success={success} />;
}
