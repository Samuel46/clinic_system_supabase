import { InvitationForm } from "@/components/invitations";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { SessionUser } from "@type/index";
import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

async function getData(user?: SessionUser, id?: string) {
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

  let invitation;

  if (id) {
    invitation = await prisma_next.invitation.findUnique({
      where: {
        scheduleId: id,
      },
      include: {
        schedule: {
          include: {
            workDays: true,
            daysOff: true,
          },
        },
      },
    });
  }

  const roles = await prisma_next.role.findMany({
    where: roleWhereClause,
  });

  return { tenants, roles, invitation };
}

export default async function CreateInvitationPage({ searchParams: { id } }: Props) {
  const user = await getCurrentUser();
  console.log(user);

  const { tenants, roles, invitation } = await getData(user, id);

  return (
    <InvitationForm
      tenants={tenants}
      roles={roles}
      currentInvitation={invitation}
      edit={Boolean(invitation)}
    />
  );
}
