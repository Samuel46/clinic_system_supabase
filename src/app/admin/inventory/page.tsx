import { InventoryList } from "@/components/inventory";
import { inventoryColumns } from "@/components/inventory/data-table/columns";

import prisma_next from "@lib/db";

import { InventoryColumns } from "@type/index";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import React from "react";

async function getData() {
  const inventories = await prisma_next.inventory.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tenant: true,
      medication: true,
    },
  });

  return { inventories };
}

export default async function InventoryListPage() {
  const { inventories } = await getData();

  const data = inventories.map((item) => ({
    id: item.id,
    medicationName: item.medication.name,
    tenantName: item.tenant.name,
    quantity: item.quantity,
    threshold: item.threshold,
    expirationDate: item.expirationDate,
    location: item.location,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  const filterableColumns = ["tenantName", "quantity", "threshold", "location"].map(
    (key) => ({
      id: key,
      title: generateTitle(key),
      options: generateUniqueOptions(data, key as keyof InventoryColumns),
    })
  );

  return (
    <InventoryList
      columns={inventoryColumns}
      data={data}
      filterableColumns={filterableColumns}
    />
  );
}
