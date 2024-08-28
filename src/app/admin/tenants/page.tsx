import { TenantList } from "@/components/tenants";
import { columns } from "@/components/tenants/data-table/columns";
import prisma_next from "@lib/db";
import { Tenant } from "@prisma/client";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import React from "react";

async function getData() {
  const tenants = await prisma_next.tenant.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return { tenants };
}

export default async function TenantsPage() {
  const { tenants } = await getData();

  const filterableColumns = ["address", "contactEmail", "contactPhone"].map((key) => ({
    id: key,
    title: generateTitle(key),
    options: generateUniqueOptions(tenants, key as keyof Tenant),
  }));

  return (
    <TenantList data={tenants} columns={columns} filterableColumns={filterableColumns} />
  );
}
