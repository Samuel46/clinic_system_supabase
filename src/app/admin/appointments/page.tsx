import { AppointmentList } from "@/components/appointments";
import { appointmentColumns } from "@/components/appointments/data-table/columns";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { AppointmentDataTable, SessionUser } from "@type/index";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import { format } from "date-fns";
import React from "react";

async function getData(user?: SessionUser) {
  const whereClause = user?.role !== "Admin" ? { tenantId: user?.tenantId } : {};

  const appointments = await prisma_next.appointment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: whereClause,
    include: {
      tenant: true,
      doctor: true,
      patient: true,
    },
  });

  return { appointments };
}
export default async function CreateAppointmentPage() {
  const user = await getCurrentUser();
  const { appointments } = await getData(user);

  const data = appointments.map((item) => ({
    id: item.id,
    time: `${format(item.startTime, "p")} to ${format(item.endTime, "p")}`,
    date: item.date,
    patient: item.patient.name,
    doctor: item.doctor.name,
    reason: item.reason,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    role: user?.role,
  }));

  const filterableColumns = ["status", "time"].map((key) => ({
    id: key,
    title: generateTitle(key),
    options: generateUniqueOptions(data, key as keyof AppointmentDataTable),
  }));
  return (
    <AppointmentList
      data={data}
      filterableColumns={filterableColumns}
      columns={appointmentColumns}
      user={user}
    />
  );
}
