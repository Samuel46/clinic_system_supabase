"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Tenant } from "@prisma/client";
import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";
import { Checkbox } from "@ui/checkbox";
import TenantAction from "./tenantAction";

export const columns: ColumnDef<Tenant>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" className="hidden" />
    ),
    cell: ({ row }) => <div className=" hidden">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <p className="max-w-[500px]  text-gray-900 truncate font-medium    ">
        {row.getValue("name")}
      </p>
    ),
  },
  {
    accessorKey: "contactPhone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Phone" />
    ),
    cell: ({ row }) => (
      <p className=" truncate text-pretty">{row.getValue("contactPhone")}</p>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Address" />,
    cell: ({ row }) => (
      <p className="max-w-[150px] truncate     text-pretty">{row.getValue("address")}</p>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "contactEmail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Email" />
    ),
    cell: ({ row }) => (
      <p className="max-w-[150px] truncate  text-pretty ">
        {row.getValue("contactEmail")}
      </p>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <TenantAction row={row} />,
  },
];
