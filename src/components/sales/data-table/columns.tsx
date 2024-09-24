"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";

import { SaleColumns } from "@type/index";
import SaleAction from "./saleAction";
import { fDate } from "@utils/formatTime";
import { PaymentStatus } from "@prisma/client";
import { Badge } from "@/components/badge";
import { formatAmountKsh } from "@utils/formatNumber";

export const saleColumns: ColumnDef<SaleColumns>[] = [
  // {
  //   accessorKey: "tenantName",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Tenant" />,
  //   cell: ({ row }) => (
  //     <p className="max-w-[150px] truncate font-medium">{row.getValue("tenantName")}</p>
  //   ),
  // },
  {
    accessorKey: "userName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
    cell: ({ row }) => (
      <p className="max-w-[150px] truncate font-medium">{row.getValue("userName")}</p>
    ),

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // {
  //   accessorKey: "customerName",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
  //   cell: ({ row }) => (
  //     <p className="max-w-[150px] truncate font-medium">{row.getValue("customerName")}</p>
  //   ),
  // },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => {
      const amount: number = row.getValue("totalAmount") as number;

      return (
        <p className="max-w-[150px] truncate font-medium text-sm">
          {formatAmountKsh(amount)}
        </p>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ row }) => (
      <p className="max-w-[150px] truncate ">{row.getValue("paymentMethod")}</p>
    ),

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Status" />
    ),
    cell: ({ row }) => {
      const status: PaymentStatus = row.getValue("paymentStatus");
      const statusColor =
        status === PaymentStatus.PENDING
          ? "amber"
          : status === PaymentStatus.COMPLETED
          ? "green"
          : "red";
      return (
        <Badge className="max-w-[250px] truncate text-sm text-pretty" color={statusColor}>
          {status}
        </Badge>
      );
    },

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => (
      <p className="max-w-[150px] truncate text-sm">
        {fDate(new Date(row.getValue("createdAt")))}
      </p>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => (
      <p className="max-w-[150px] truncate text-sm">
        {fDate(new Date(row.getValue("updatedAt")))}
      </p>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <SaleAction row={row} />,
  },
];
