"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Icons } from "@ui/icons";
import { Row } from "@tanstack/react-table";

import { toast } from "sonner";

import { SupplyColumns } from "@type/index";
import { SupplyDelete } from "../dialog";

import { deleteComponentAction } from "@actions/components.action";

export default function SupplyAction({ row }: { row: Row<SupplyColumns> }) {
  const userRole = row.original.role;

  const isEnabled = userRole === "Admin" || userRole === "Clinic";

  const [openModel, setOpenModel] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(false);

  const { push, refresh } = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleEdit = async () => {
    push(`supplies/edit?id=${row.original.id}`);
  };

  const handleView = async () => {
    push(`supplies/${row.original.id}`);
  };

  const handleDropdownMenu = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleDelete = async () => {
    startTransition(() => {
      deleteComponentAction(row.original.id).then((result) => {
        if (result.success) {
          toast.success(result.msg);

          refresh();
        } else {
          toast.error(result.msg);
        }
      });
      refresh();
      setOpenModel(false);
    });
  };

  return (
    <>
      <DropdownMenu open={openDropdown} onOpenChange={() => handleDropdownMenu()}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <Icons.menuIcon className="h-7 w-7 text-muted-foreground/70" />

            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => handleEdit()} disabled={!isEnabled}>
            <Icons.penIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleView()}>
            <Icons.view className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            View
          </DropdownMenuItem>

          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpenModel(true)} disabled={!isEnabled}>
              <TrashIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 text-red-600" />
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        </DropdownMenuContent>
      </DropdownMenu>

      <SupplyDelete
        isOpen={openModel}
        setIsOpen={setOpenModel}
        pending={isPending}
        handleDelete={handleDelete}
      />
    </>
  );
}
