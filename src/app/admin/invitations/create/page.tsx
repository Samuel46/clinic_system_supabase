import { InvitationForm } from "@/components/invitations";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { SessionUser } from "@type/index";
import React from "react";

async function getData(user?: SessionUser) {
  const tenantWhereClause = user?.role !== "Admin" ? { id: user?.tenantId } : {};

  const roleWhereClause = {
    name: {
      notIn: user?.role !== "Admin" ? ["Admin", "Clinic", "Pharmacist"] : [],
    },
  };

  const tenants = await prisma_next.tenant.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: tenantWhereClause,
  });

  const roles = await prisma_next.role.findMany({
    where: roleWhereClause,
  });

  return { tenants, roles };
}

export default async function CreateInvitationPage() {
  const user = await getCurrentUser();
  console.log(user);

  const { tenants, roles } = await getData(user);

  return <InvitationForm tenants={tenants} roles={roles} />;
}
