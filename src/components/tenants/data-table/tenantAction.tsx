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
import { Tenant } from "@prisma/client";
import { DeleteDialog } from "../dialog";
import { toast } from "sonner";
import { deleteTenantAction } from "@actions/tenants.action";

export default function TenantAction({ row }: { row: Row<Tenant> }) {
  const [openModel, setOpenModel] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(false);

  const { push, refresh } = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleEdit = async () => {
    push(`tenants/${row.original.id}`);
  };

  const handleDropdownMenu = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleDelete = async () => {
    startTransition(() => {
      deleteTenantAction(row.original.id).then((result) => {
        if (result.success) {
          toast.success(result.msg);
          // Refresh or redirect logic here
          refresh(); // or use router.push to navigate
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
          <DropdownMenuItem onClick={() => handleEdit()}>
            <Icons.penIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleEdit()}>
            <Icons.view className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            View
          </DropdownMenuItem>

          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpenModel(true)}>
              <TrashIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 text-red-600" />
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete model */}

      <DeleteDialog
        isOpen={openModel}
        setIsOpen={setOpenModel}
        pending={isPending}
        handleDelete={handleDelete}
      />
      {/* <DeleteModel
        isPending={isPending}
        handleDelete={handleDelete}
        openModel={openModel}
        setOpenModel={setOpenModel}
      /> */}

      {/* Share model */}
      {/* <ShareModel
        isPending={isPending}
        openModel={openShareModel}
        setOpenModel={setOpenShareModel}
        projectId={id}
      /> */}
    </>
  );
}
