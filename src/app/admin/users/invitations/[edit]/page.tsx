import { InvitationForm } from "@/components/invitations";
import prisma_next from "@lib/db";
import React from "react";

interface Props {
  params: {
    edit: string;
  };
}

async function getData(id: string) {
  const invitation = await prisma_next.invitation.findUnique({
    where: {
      id,
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
  const tenants = await prisma_next.tenant.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const roles = await prisma_next.role.findMany({});

  return { tenants, roles, invitation };
}

export default async function EditInvitationPage({ params: { edit: id } }: Props) {
  const { tenants, roles, invitation } = await getData(id);
  return (
    <InvitationForm tenants={tenants} roles={roles} currentInvitation={invitation} edit />
  );
}
