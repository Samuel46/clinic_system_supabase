"use client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";
import PrescriptionAction from "./prescriptionAction";
import { PrescriptionColumns } from "@type/index";
import { fDate } from "@utils/formatTime";

export const prescriptionColumns: ColumnDef<PrescriptionColumns>[] = [
  // {
  //   accessorKey: "tenantName",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Tenant" />,
  //   cell: ({ row }) => <div>{row.getValue("tenantName")}</div>,
  // },
  {
    accessorKey: "patientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => (
      <p className="max-w-[250px] truncate font-medium text-gray-900  text-pretty">
        {row.getValue("patientName")}
      </p>
    ),
  },
  {
    accessorKey: "doctorName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Doctor" />,
    cell: ({ row }) => (
      <p className="truncate text-pretty">{row.getValue("doctorName")}</p>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "medicationName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Medication" />,
    cell: ({ row }) => (
      <p className="max-w-[150px] truncate text-pretty text-gray-900">
        {row.getValue("medicationName")}
      </p>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "dosage",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Dosage" />,
    cell: ({ row }) => <p>{row.getValue("dosage")}</p>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "frequency",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Frequency" />,
    cell: ({ row }) => <p>{row.getValue("frequency")}</p>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Duration" />,
    cell: ({ row }) => (
      <p className=" truncate  text-pretty">{row.getValue("duration")}</p>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => <p className="">{fDate(row.getValue("createdAt"))}</p>,
  },
  // {
  //   accessorKey: "updatedAt",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
  //   cell: ({ row }) => <div>{fDate(row.getValue("updatedAt"))}</div>,
  // },
  {
    id: "actions",
    cell: ({ row }) => <PrescriptionAction row={row} />,
  },
];
