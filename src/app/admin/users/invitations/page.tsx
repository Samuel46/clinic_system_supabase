import { InvitationList } from "@/components/invitations";
import { invitationColumns } from "@/components/invitations/data-table/columns";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { InvitationColumns, SessionUser } from "@type/index";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import React from "react";

async function getData(user?: SessionUser) {
  const whereClause = {
    ...(user?.role !== "Admin" && { tenantId: user?.tenantId }),
    email: {
      not: user?.email ?? "", // Exclude the invitation with the current user's email
    },
  };

  const invitations = await prisma_next.invitation.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: whereClause,
    include: {
      tenant: true,
      role: true,
    },
  });

  return { invitations };
}

export default async function InvitationListPage() {
  const user = await getCurrentUser();

  const { invitations } = await getData(user);

  const data = invitations.map((item) => ({
    id: item.id,
    email: item.email,
    token: item.token,
    expiresAt: item.expiresAt,
    tenantName: item.tenant.name,
    roleName: item.role.name,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  const filterableColumns = ["roleName", "tenantName"].map((key) => ({
    id: key,
    title: generateTitle(key),
    options: generateUniqueOptions(data, key as keyof InvitationColumns),
  }));

  return (
    <InvitationList
      columns={invitationColumns}
      data={data}
      filterableColumns={filterableColumns}
    />
  );
}
