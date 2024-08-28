"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";
import { format } from "date-fns";
import { Appointment, AppointmentStatus } from "@prisma/client";

import AppointmentAction from "./appointmentAction";
import { AppointmentDataTable } from "@type/index";
import { Badge } from "@/components/badge";
import Link from "next/link";

export const appointmentColumns: ColumnDef<AppointmentDataTable>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const date: Date = row.getValue("date");
      return (
        <p className="max-w-[150px] truncate font-medium text-pretty">
          {format(date, "PPP")}
        </p>
      );
    },
  },
  {
    accessorKey: "time",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
    cell: ({ row }) => {
      const time: string = row.getValue("time");
      return <p className="max-w-[250px] truncate font-medium text-pretty">{time}</p>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => {
      const patientName: string = row.getValue("patient");
      return (
        <p className="max-w-[150px] truncate font-medium text-pretty">{patientName}</p>
      );
    },
  },
  {
    accessorKey: "doctor",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Staff" />,
    cell: ({ row }) => {
      const doctorName: string = row.getValue("doctor");
      return (
        <Link href={`/edit/${row.original.id}`}>
          <p className="max-w-[150px] truncate font-medium text-pretty">{doctorName}</p>
        </Link>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "reason",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reason" />,
    cell: ({ row }) => {
      const reason: string = row.getValue("reason");
      return <p className="max-w-[250px] truncate  text-pretty">{reason}</p>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status: AppointmentStatus = row.getValue("status");
      const statusColor =
        status === AppointmentStatus.SCHEDULED
          ? "sky"
          : status === AppointmentStatus.COMPLETED
          ? "green"
          : "red";
      return (
        <Badge
          className="max-w-[250px] truncate font-medium text-pretty"
          color={statusColor}
        >
          {status}
        </Badge>
      );
    },

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <AppointmentAction row={row} />,
  },
];
