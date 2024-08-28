import { TenantForm } from "@/components/tenants";
import prisma_next from "@lib/db";
import React from "react";

interface Props {
  params: {
    edit: string;
  };
}

async function getData(id: string) {
  const tenant = await prisma_next.tenant.findUnique({
    where: {
      id: id,
    },
  });

  return { tenant };
}

export default async function TenantEditPage({ params: { edit: id } }: Props) {
  const { tenant } = await getData(id);

  return <TenantForm currentTenant={tenant} edit />;
}
