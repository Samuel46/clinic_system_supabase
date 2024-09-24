"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TreatmentColumns } from "@type/index";
import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";
import { fDate } from "@utils/formatTime";
import TreatmentAction from "./treatmentActions";

export const treatmentColumns: ColumnDef<TreatmentColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Procedure Name" />
    ),
    cell: ({ row }) => (
      <p className="font-medium min-w-[150px] w-full">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => (
      <p className="max-w-[200px] text-sm truncate text-pretty">
        {row.getValue("description") || "N/A"}
      </p>
    ),
  },

  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
    cell: ({ row }) => (
      <p className="max-w-[150px] text-sm truncate text-pretty">
        {row.getValue("type") || "N/A"}
      </p>
    ),
  },
  {
    accessorKey: "doctor",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created by" />,
    cell: ({ row }) => <p>{row.getValue("doctor")} </p>,
  },
  {
    accessorKey: "procedure",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Procedure" />,
    cell: ({ row }) => (
      <p className="max-w-[150px] text-sm truncate text-pretty">
        {row.getValue("procedure") || "N/A"}
      </p>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <p>{fDate(row.getValue("createdAt"))}</p>,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => <p>{fDate(row.getValue("updatedAt"))}</p>,
  },

  {
    id: "actions",
    cell: ({ row }) => <TreatmentAction row={row} />,
  },
];
