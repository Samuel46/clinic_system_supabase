import React, { useState } from "react";
import { Subheading } from "@/components/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { Appointment, AppointmentStatus } from "@prisma/client";
import { format } from "date-fns";
import { fDate } from "@utils/formatTime";
import { Badge } from "@/components/badge";

interface Props {
  appointments: Appointment[];
}

export default function StaffAppointments({ appointments }: Props) {
  return (
    <div className="py-10">
      <Subheading>Appointment history</Subheading>
      <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Date</TableHeader>
            <TableHeader>Time</TableHeader>
            <TableHeader>Reason</TableHeader>
            <TableHeader className="text-right">Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
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
