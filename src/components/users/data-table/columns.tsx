"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";
import { UserWithRoleAndTenant } from "@type/index";
import { Checkbox } from "@ui/checkbox";
import UserAction from "./userAction";
import { fDate } from "@utils/formatTime";

export const userColumns: ColumnDef<UserWithRoleAndTenant>[] = [
  //   {
  //     id: "select",
  //     header: ({ table }) => (
  //       <Checkbox
  //         checked={table.getIsAllPageRowsSelected()}
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //         className="translate-y-[2px]"
  //       />
  //     ),
  //     cell: ({ row }) => (
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //         className="translate-y-[2px]"
  //       />
  //     ),
  //     enableSorting: false,
  //     enableHiding: false,
  //   },
  //   {
  //     accessorKey: "id",
  //     header: ({ column }) => (
  //       <DataTableColumnHeader column={column} title="ID" className="hidden" />
  //     ),
  //     cell: ({ row }) => <div className=" hidden">{row.getValue("id")}</div>,
  //     enableSorting: true,
  //     enableHiding: false,
  //   },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <p className="max-w-[250px] truncate font-medium text-pretty">
        {row.getValue("name")}
      </p>
    ),
  },

  {
    accessorKey: "tenant",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tenant" />,
    cell: ({ row }) => (
      <p className="max-w-[150px] truncate font-medium text-pretty">
        {row.getValue("tenant")}
      </p>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => (
      <p className="max-w-[150px] truncate font-medium text-pretty">
        {row.getValue("role")}
      </p>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <p className="max-w-[250px]  truncate font-medium text-pretty ">
        {row.getValue("email")}
      </p>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => (
      <p className="max-w-[250px] truncate font-medium text-pretty">
        {fDate(row.getValue("createdAt"))}
      </p>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <UserAction row={row} />,
  },
];
