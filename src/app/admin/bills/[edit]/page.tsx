import { BillForm } from "@/components/bills";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { SessionUser } from "@type/index";
import React from "react";

interface Props {
  params: {
    edit: string;
  };
}

async function getData(id: string, user?: SessionUser) {
  const bill = await prisma_next.billing.findUnique({
    where: { id },
    include: {
      tenant: true,
      patient: true,
    },
  });

  const whereClause = user?.role !== "Admin" ? { tenantId: user?.tenantId } : {};

  const patients = await prisma_next.patient.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: whereClause,
    include: {
      tenant: true,
    },
  });

  return { patients, bill };
}

export default async function EditBillPage({ params: { edit: id } }: Props) {
  const user = await getCurrentUser();

  const { patients, bill } = await getData(id, user);

  return <BillForm user={user} patients={patients} currentBilling={bill} edit />;
}
