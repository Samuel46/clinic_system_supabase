"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ProcedureColumns } from "@type/index";
import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";
import { fDate } from "@utils/formatTime";
import ProcedureAction from "./procedureAction";

export const procedureColumns: ColumnDef<ProcedureColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Procedure Name" />
    ),
    cell: ({ row }) => (
      <p className="font-medium text-gray-900   min-w-[150px]">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => (
      <p className="max-w-[200px]  truncate text-pretty">
        {row.getValue("description") || "N/A"}
      </p>
    ),
  },
  {
    accessorKey: "steps",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Steps Count" />,
    cell: ({ row }) => <p>{row.getValue("steps")} steps</p>,
  },
  {
    accessorKey: "equipment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Equipment Count" />
    ),
    cell: ({ row }) => <p>{row.getValue("equipment")} equipment items</p>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <p>{fDate(row.getValue("createdAt"))}</p>,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => <p className=" ">{fDate(row.getValue("updatedAt"))}</p>,
  },

  {
    id: "actions",
    cell: ({ row }) => <ProcedureAction row={row} />, // Procedure-specific action component
  },
];
