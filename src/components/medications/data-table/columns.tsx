"use client";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";

import { MedicationColumns } from "@type/index";
import { fDate } from "@utils/formatTime";

import MedicationAction from "./medicationAction";

export const medicationColumns: ColumnDef<MedicationColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <p className="font-medium text-gray-900">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "tenantName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tenant" />,
    cell: ({ row }) => <p>{row.getValue("tenantName")}</p>,

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => (
      <p className="max-w-[350px] truncate  text-pretty">{row.getValue("description")}</p>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
    cell: ({ row }) => <div>{row.getValue("price")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "unit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Unit" />,
    cell: ({ row }) => <div>{row.getValue("unit")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => (
      <p className="max-w-[150px] truncate  text-pretty">
        {fDate(new Date(row.getValue("createdAt")))}
      </p>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => (
      <p className="max-w-[150px] truncate  text-pretty">
        {fDate(new Date(row.getValue("updatedAt")))}
      </p>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <MedicationAction row={row} />,
  },
];
