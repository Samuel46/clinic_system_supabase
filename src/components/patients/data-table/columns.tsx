"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";
import PatientAction from "./patientAction";
import { fDate } from "@utils/formatTime";
import { PatientColumns } from "@type/index";

export const patientColumns: ColumnDef<PatientColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <p className="font-medium min-w-[150px] w-full">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <p className="max-w-[200px] font-medium truncate text-pretty">
        {row.getValue("email")}
      </p>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    cell: ({ row }) => <p>{row.getValue("phone")}</p>,

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date of Birth" />
    ),
    cell: ({ row }) => (
      <p>{row.getValue("dateOfBirth") ? fDate(row.getValue("dateOfBirth")) : "N/A"}</p>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <p>{fDate(row.getValue("createdAt"))}</p>,
  },

  {
    accessorKey: "tenantName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tenant" />,
    cell: ({ row }) => <p>{row.getValue("tenantName")}</p>,
  },
  {
    id: "actions",
    cell: ({ row }) => <PatientAction row={row} />, // Ensure this component is correctly defined and imported
  },
];
