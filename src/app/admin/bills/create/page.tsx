import { BillForm } from "@/components/bills";
import { PatientForm } from "@/components/patients";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { SessionUser } from "@type/index";
import React from "react";

async function getData(user?: SessionUser) {
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

  return { patients };
}
export default async function CreateBillPage() {
  const user = await getCurrentUser();

  const { patients } = await getData(user);

  return <BillForm user={user} patients={patients} />;
}
