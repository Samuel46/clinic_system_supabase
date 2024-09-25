"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { FadeIn } from "@/components/FadeIn";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import useUpdateInventory from "@hooks/useUpdateInventory";
import { Tenant } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { FilterableColumn, InventoryColumns, SessionUser } from "@type/index";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";

import { DataTablePagination } from "@ui/table/DataTablePagination";
import { DataTableToolbar } from "@ui/table/DataTableToolbar";
import { DataTableViewOptions } from "@ui/table/DataTableViewOptions";
import { DataTable } from "@ui/table/index";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: InventoryColumns[];
  filterableColumns: FilterableColumn[];
  user?: SessionUser;
  tenant: Tenant | null;
}

export default function InventoryList<TData, TValue>({
  columns,
  data,
  filterableColumns,
  user,
  tenant,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const router = useRouter();

  const { currentInventories } = useUpdateInventory(tenant, user, data);

  const table = useReactTable({
    data: currentInventories as TData[],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // filterableColumns.ts

  return (
    <FadeIn className=" space-y-6">
      <div className="flex items-center bg-muted/70 p-8 py-10 rounded-2xl">
        <DataTableToolbar
          filterableColumns={filterableColumns}
          placeholderText="Filter medication..."
          table={table}
          filter="medicationName"
        />
        <div className="ml-auto flex items-center gap-2">
          <DataTableViewOptions table={table} />

          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={() => router.push("/admin/inventory/create")}
          >
            <PlusCircleIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add inventory
            </span>
          </Button>
        </div>
      </div>
      {/* {warnings.length > 0 && <Notification messages={warnings} type="warning" setMessages={setWarnings} />} */}
      <Card className=" rounded-2xl">
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>
            Overview of all your inventory. Possible to view and edit from here
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DataTable table={table} columns={columns} />
        </CardContent>

        <CardFooter>
          <DataTablePagination table={table} />
        </CardFooter>
      </Card>
    </FadeIn>
  );
}
