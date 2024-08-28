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

async function getData(id: string, user?: SessionUser) {
  const appointment = await prisma_next.appointment.findUnique({
    where: {
      id,
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

  return { appointment, patients };
}
export default async function EditAppointmentPage({ searchParams: { id } }: Props) {
  const user = await getCurrentUser();

  const { patients, appointment } = await getData(id, user);
  return (
    <h5>
      <AppointmentForm
        user={user}
        patients={patients}
        currentAppointment={appointment}
        edit
      />
    </h5>
  );
}
