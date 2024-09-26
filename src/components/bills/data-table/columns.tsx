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
    cell: ({ row }) => (
      <p className="font-medium  text-gray-900 ">{row.getValue("patientName")}</p>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => <p>{formatAmountKsh(row.getValue("amount"))}</p>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "staff",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Staff" />,
    cell: ({ row }) => <p>{row.getValue("staff")}</p>,
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
      return <Badge color={statusColor}>{status}</Badge>;
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
    cell: ({ row }) => <p>{row.getValue("paymentMethod")}</p>,

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <div>{fDate(new Date(row.getValue("createdAt")))}</div>,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
    cell: ({ row }) => <div>{fDate(new Date(row.getValue("updatedAt")))}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <BillAction row={row} />,
  },
];
