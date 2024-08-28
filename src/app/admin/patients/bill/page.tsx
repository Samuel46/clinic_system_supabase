import { PatientBillForm } from "@/components/patients/details/bills";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

async function getData(id: string) {
  const bill = await prisma_next.billing.findUnique({
    where: {
      id: id,
    },
  });

  return { bill };
}
export default async function PatientBillPage({ searchParams: { id } }: Props) {
  const { bill } = await getData(id);
  const user = await getCurrentUser();
  return <PatientBillForm currentBilling={bill} edit user={user} />;
}
