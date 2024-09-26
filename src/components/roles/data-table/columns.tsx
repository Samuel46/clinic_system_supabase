"use client";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@ui/badge";

import { Permission, Role, RolePermission } from "@prisma/client";
import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";
import RoleAction from "./roleAction";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Button } from "@ui/button";
import { ScrollArea } from "@ui/scroll-area";

export const roleColumns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role Name" />,
    cell: ({ row }) => (
      <p className=" font-medium text-gray-900">{row.getValue("name")}</p>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
    cell: ({ row }) => (
      <div className="max-w-[450px]  text-pretty">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "permissions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Permissions" />,
    cell: ({ row }) => {
      const rolePermissions: RolePermission & { permission: Permission }[] =
        row.getValue("permissions");

      const permissions = rolePermissions.map((rp) => rp.permission);
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              View Permissions
            </Button>
          </PopoverTrigger>
          <PopoverContent className=" p-2 px-4">
            <ScrollArea className="h-[400px] w-full py-2">
              <div className="flex flex-wrap space-y-2  truncate font-medium text-pretty">
                {permissions.length > 0 ? (
                  permissions.map((perm) => (
                    <Badge
                      key={perm.id}
                      variant="secondary"
                      className=" py-2 truncate w-full text-center items-center  "
                    >
                      {perm.action}
                    </Badge>
                  ))
                ) : (
                  <span>No permissions assigned</span>
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <RoleAction row={row} />,
  },
];
