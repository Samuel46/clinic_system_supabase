import { SaleList } from "@/components/sales";
import { saleColumns } from "@/components/sales/data-table/columns";

import prisma_next from "@lib/db";

import { SaleColumns } from "@type/index";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import React from "react";

async function getData() {
  const sales = await prisma_next.sale.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      tenant: true,
      user: true,
      customer: true,
    },
  });

  return { sales };
}
export default async function SaleListPage() {
  const { sales } = await getData();

  const data = sales.map((item) => ({
    id: item.id,
    tenantName: item.tenant.name,
    userName: item.user.name,
    customerName: item.customer?.name!,
    totalAmount: item.totalAmount,
    paymentMethod: item.paymentMethod,
    paymentStatus: item.paymentStatus,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  const filterableColumns = ["userName", "paymentMethod", "paymentStatus"].map((key) => ({
    id: key,
    title: generateTitle(key),
    options: generateUniqueOptions(data, key as keyof SaleColumns),
  }));
  return (
    <div>
      <SaleList data={data} filterableColumns={filterableColumns} columns={saleColumns} />
    </div>
  );
}
