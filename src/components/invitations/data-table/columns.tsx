"use client";
import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";
import InvitationAction from "./invitationAction";
import { InvitationColumns } from "@type/index";
import { Badge } from "@/components/badge";
import { fDateTime } from "@utils/formatTime";
import { InvitationStatus } from "@prisma/client";

export const invitationColumns: ColumnDef<InvitationColumns>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <p className="max-w-[250px] truncate font-medium text-gray-900  text-pretty">
        {row.getValue("email")}
      </p>
    ),
  },
  {
    accessorKey: "tenantName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tenant" />,
    cell: ({ row }) => (
      <p className="max-w-[500px] w-[150px] truncate">{row.getValue("tenantName")}</p>
    ),

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "roleName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => (
      <p className="max-w-[150px] truncate  text-pretty">{row.getValue("roleName")}</p>
    ),

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status: InvitationStatus = row.getValue("status");
      const statusColor = (status: InvitationStatus) => {
        switch (status) {
          case InvitationStatus.EXPIRED:
            return "red";
          case InvitationStatus.ACCEPTED:
            return "lime";
          case InvitationStatus.DECLINED:
            return "rose";
          case InvitationStatus.PENDING:
            return "amber";
          default:
            return "blue"; // Default case if none of the statuses match
        }
      };

      return (
        <Badge className=" truncate text-pretty" color={statusColor(status)}>
          {status}
        </Badge>
      );
    },

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "expiresAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expires At" />,
    cell: ({ row }) => (
      <Badge color="red" className="max-w-[q50px] truncate text-pretty ">
        {fDateTime(row.getValue("expiresAt"))}
      </Badge>
    ),

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => (
      <Badge color="lime" className=" truncate text-pretty">
        {fDateTime(row.getValue("createdAt"))}
      </Badge>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <InvitationAction row={row} />,
  },
];
