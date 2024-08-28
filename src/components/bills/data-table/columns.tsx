"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";
import PatientAction from "./billAction";
import { fDate } from "@utils/formatTime";
import { BillingColumns, PatientWithTenant } from "@type/index";
import { BillingStatus } from "@prisma/client";
import { format } from "date-fns";
import { Badge } from "@/components/badge";
import BillAction from "./billAction";
import { formatAmountKsh } from "@utils/formatNumber";

export const billingColumns: ColumnDef<BillingColumns>[] = [
  {
    accessorKey: "patientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("patientName")}</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => (
      <div className="font-medium">{formatAmountKsh(row.getValue("amount"))}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "staff",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Staff" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("staff")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status: BillingStatus = row.getValue("status");
      const statusColor =
        status === BillingStatus.UNPAID
          ? "red"
          : status === BillingStatus.PAID
          ? "green"
          : "sky";
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
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("paymentMethod")}</div>,

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => (
      <div className="font-medium">{fDate(new Date(row.getValue("createdAt")))}</div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => (
      <div className="font-medium">{fDate(new Date(row.getValue("updatedAt")))}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <BillAction row={row} />,
  },
];
