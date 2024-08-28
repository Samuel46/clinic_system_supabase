import { RoleForm } from "@/components/roles";
import prisma_next from "@lib/db";
import React from "react";

interface Props {
  params: {
    edit: string;
  };
}

async function getData(id: string) {
  const role = await prisma_next.role.findUnique({
    where: {
      id: id,
    },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  return { role };
}

export default async function TenantEditPage({ params: { edit: id } }: Props) {
  const { role } = await getData(id);

  return <RoleForm currentRole={role} edit />;
}
