import RoleList from "@/components/roles/data-table";
import { roleColumns } from "@/components/roles/data-table/columns";
import prisma_next from "@lib/db";
import { Role } from "@prisma/client";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import React from "react";

async function getData() {
  const roles = await prisma_next.role.findMany({
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  return { roles };
}
export default async function RolePage() {
  const { roles } = await getData();
  const filterableColumns = ["permission"].map((key) => ({
    id: key,
    title: generateTitle(key),
    options: generateUniqueOptions(roles, key as keyof Role),
  }));

  return (
    <RoleList columns={roleColumns} data={roles} filterableColumns={filterableColumns} />
  );
}
