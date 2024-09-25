import { SuppliesList } from "@/components/supplies";
import { supplyColumns } from "@/components/supplies/data-table";

import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { SessionUser, SupplyColumns } from "@type/index";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import React from "react";
async function getData(user?: SessionUser) {
  const whereClause = user?.role !== "Admin" ? { tenantId: user?.tenantId } : {};

  const supplies = await prisma_next.component.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: whereClause,
    include: {
      tenant: true,
    },
  });

  return { supplies };
}

export default async function SuppliesListPage() {
  const { supplies } = await getData();

  const user = await getCurrentUser();

  const data = supplies.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    unitCost: item.unitCost,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    role: user?.role,
  }));

  const filterableColumns = ["name", "unitCost"].map((key) => ({
    id: key,
    title: generateTitle(key),
    options: generateUniqueOptions(data, key as keyof SupplyColumns),
  }));

  return (
    <SuppliesList
      data={data}
      columns={supplyColumns}
      filterableColumns={filterableColumns}
    />
  );
}
