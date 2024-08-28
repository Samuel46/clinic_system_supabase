import { AppointmentForm } from "@/components/appointments";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { SessionUser } from "@type/index";
import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}
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
export default async function CreateAppointmentPage({ searchParams: { id } }: Props) {
  const user = await getCurrentUser();

  const { patients } = await getData(user);
  return <AppointmentForm user={user} patients={patients} id={id} />;
}
