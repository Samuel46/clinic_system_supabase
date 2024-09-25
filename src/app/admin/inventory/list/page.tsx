import React from "react";

import { InventoryList } from "@/components/inventory";
import { inventoryColumns } from "@/components/inventory/data-table/columns";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { InventoryColumns, SessionUser } from "@type/index";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import { Inventory } from "@prisma/client";

async function getData(user?: SessionUser) {
  const inventories = await prisma_next.inventory.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      tenant: true,
      medication: true,
    },
  });

  const tenant = await prisma_next.tenant.findUnique({
    where: {
      id: user?.tenantId,
    },
  });

  return { inventories, tenant };
}

export default async function InventoryListPage() {
  const user = await getCurrentUser();
  const { inventories, tenant } = await getData(user);

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
      user={user}
      tenant={tenant}
      columns={inventoryColumns}
      data={data}
      filterableColumns={filterableColumns}
    />
  );
}
