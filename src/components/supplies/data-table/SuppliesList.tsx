"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DataTable } from "@ui/table/index";

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

import { Button } from "@ui/button";
import { DataTableToolbar } from "@ui/table/DataTableToolbar";
import { DataTablePagination } from "@ui/table/DataTablePagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";

import { PlusCircleIcon } from "@heroicons/react/20/solid";

import { DataTableViewOptions } from "@ui/table/DataTableViewOptions";

import { FilterableColumn } from "@type/index";
import { FadeIn } from "@/components/FadeIn";

import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { supabase } from "@lib/supabase/client";
import { toast } from "sonner";
import { Component } from "@prisma/client";
import { fDate } from "@utils/formatTime";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterableColumns: FilterableColumn[];
}

export default function SuppliesList<TData, TValue>({
  columns,
  data,
  filterableColumns,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [realtimeData, setRealtimeData] = useState<TData[]>(data);

  const router = useRouter();

  const table = useReactTable({
    data: realtimeData,
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

  useEffect(() => {
    const handleData = async (payload: { new: Component }) => {
      const newData = payload.new;

      console.log(newData, "newData");

      setRealtimeData((prevData) => [newData as TData, ...prevData]);

      toast.info(`New supply ${newData.name} added at ${fDate(newData.createdAt)}`, {
        position: "top-right",
        duration: 5000,
      });
    };

    const channel = supabase
      .channel("supply added")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Component" },
        handleData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [realtimeData]);

  return (
    <FadeIn className=" space-y-6">
      <DynamicBreadcrumb />
      <div className="flex items-center bg-muted/70 p-8 py-10 rounded-2xl">
        <DataTableToolbar
          filterableColumns={filterableColumns}
          placeholderText="Filter name..."
          table={table}
        />
        <div className="ml-auto flex items-center gap-2">
          <DataTableViewOptions table={table} />

          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={() => router.push("supplies/create")}
          >
            <PlusCircleIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add supply
            </span>
          </Button>
        </div>
      </div>

      <Card className=" rounded-2xl">
        <CardHeader>
          <CardTitle>Supplies</CardTitle>
          <CardDescription>
            Overview of all your supplies. Possible to view and edit from here
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DataTable table={table} columns={columns} link="/admin/supplies/" />
        </CardContent>

        <CardFooter>
          <DataTablePagination table={table} />
        </CardFooter>
      </Card>
    </FadeIn>
  );
}