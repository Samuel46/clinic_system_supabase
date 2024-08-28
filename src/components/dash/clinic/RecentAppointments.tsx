import { Subheading } from "@/components/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { AppointmentStatus } from "@prisma/client";
import { format } from "date-fns";
import { fDate } from "@utils/formatTime";
import { Badge } from "@/components/badge";

import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { SessionUser } from "@type/index";

async function fetchRecentAppointments(user?: SessionUser, limit: number = 5) {
  // Build the where clause based on the user's role
  const whereClause = user?.role === "Admin" ? {} : { tenantId: user?.tenantId };

  const recentAppointments = await prisma_next.appointment.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
    take: limit, // Limit the number of records fetched
    include: {
      tenant: true,
      doctor: true,
      patient: true,
    },
  });

  return recentAppointments;
}
export default async function RecentAppointments() {
  const user = await getCurrentUser();
  const recentAppointments = await fetchRecentAppointments(user, 10);

  return (
    <div className="py-10">
      <Subheading>Recent appointments</Subheading>
      <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Time</TableHeader>
            <TableHeader>Staff</TableHeader>
            <TableHeader>Reason</TableHeader>
            <TableHeader className="text-right">Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {recentAppointments.length > 0 ? (
            recentAppointments.map((appointment) => (
              <TableRow
                key={appointment.id}
                className=" cursor-pointer"
                href={`/admin/appointments/${appointment.id}`}
              >
                <TableCell>{fDate(appointment.date)}</TableCell>
                <TableCell className="text-zinc-500">
                  {format(appointment.startTime, "p")} to{" "}
                  {format(appointment.endTime, "p")}
                </TableCell>
                <TableCell>{appointment.doctor.name}</TableCell>
                <TableCell>{appointment.reason}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    className="max-w-[250px] truncate font-medium text-pretty"
                    color={
                      appointment.status === AppointmentStatus.SCHEDULED
                        ? "sky"
                        : appointment.status === AppointmentStatus.COMPLETED
                        ? "green"
                        : "red"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No appointments found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
