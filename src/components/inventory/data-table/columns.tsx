"use client";
import { ColumnDef } from "@tanstack/react-table";
import { InventoryColumns } from "@type/index";
import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";
import { fDate } from "@utils/formatTime";
import InventoryAction from "./inventoryAction";

export const inventoryColumns: ColumnDef<InventoryColumns>[] = [
  {
    accessorKey: "medicationName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Medication" />,
    cell: ({ row }) => (
      <p className="max-w-[350px] truncate font-medium text-pretty">
        {row.getValue("medicationName")}
      </p>
    ),
  },
  {
    accessorKey: "tenantName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tenant" />,
    cell: ({ row }) => (
      <p className="max-w-[350px] truncate font-medium text-pretty">
        {row.getValue("tenantName")}
      </p>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quantity" />,
    cell: ({ row }) => <div>{row.getValue("quantity")}</div>,

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "threshold",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Threshold" />,
    cell: ({ row }) => <div>{row.getValue("threshold")}</div>,

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "expirationDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expiration Date" />
    ),
    cell: ({ row }) => (
      <div>
        {row.getValue("expirationDate") ? fDate(row.getValue("expirationDate")) : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    cell: ({ row }) => <div>{row.getValue("location") || "N/A"}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <div>{fDate(row.getValue("createdAt"))}</div>,
  },
  // {
  //   accessorKey: "updatedAt",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
  //   cell: ({ row }) => <div>{fDate(row.getValue("updatedAt"))}</div>,
  // },
  {
    id: "actions",
    cell: ({ row }) => <InventoryAction row={row} />,
  },
];
