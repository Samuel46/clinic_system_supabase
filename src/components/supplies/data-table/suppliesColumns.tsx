"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SupplyColumns } from "@type/index";
import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";
import { formatAmountKsh } from "@utils/formatNumber";

import { fDate } from "@utils/formatTime";
import SupplyAction from "./suppliesActions";

export const supplyColumns: ColumnDef<SupplyColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <p className="font-medium min-w-[150px] w-full">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => (
      <p className="max-w-[200px] font-medium truncate text-pretty">
        {row.getValue("description")}
      </p>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "unitCost",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Unit Cost" />,
    cell: ({ row }) => <p>{formatAmountKsh(row.getValue("unitCost") as number)}</p>,
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
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => <p>{fDate(row.getValue("updatedAt"))}</p>,
  },
  {
    id: "action",
    cell: ({ row }) => {
      return <SupplyAction row={row} />;
    },
  },
];
