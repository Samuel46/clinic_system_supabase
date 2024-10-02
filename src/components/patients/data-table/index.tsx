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
import { Patient } from "@prisma/client";
import { fDate } from "@utils/formatTime";
import { Gradient } from "@ui/gradient";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterableColumns: FilterableColumn[];
}

export default function PatientList<TData, TValue>({
  columns,
  data,
  filterableColumns,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [patients, setPatients] = useState<TData[]>(data);

  console.log(patients);

  const router = useRouter();

  const table = useReactTable({
    data: patients,
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
    const handleNewPatient = async (payload: { new: Patient }) => {
      const newPatient = payload.new;

      setPatients((prevPatients) => [newPatient as TData, ...prevPatients]);

      toast.info(
        `New patient ${newPatient.name} added at ${fDate(newPatient.createdAt)}`,
        {
          position: "top-right",
          duration: 5000,
        }
      );
    };

    const channel = supabase
      .channel("patient added")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Patient" },
        handleNewPatient
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  // filterableColumns.ts

  return (
    <FadeIn className=" space-y-6">
      <DynamicBreadcrumb />
      <Gradient className="relative rounded-2xl">
        <div className=" isolate flex items-center bg-muted/70 p-8 py-10 inset-2 rounded-2xl">
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
              onClick={() => router.push("patients/create")}
            >
              <PlusCircleIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add patient
              </span>
            </Button>
          </div>
        </div>
      </Gradient>

      <Card className=" rounded-2xl">
        <CardHeader>
          <CardTitle>Patients</CardTitle>
          <CardDescription>
            Overview of all your patient. Possible to view and edit from here
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DataTable table={table} columns={columns} link="/admin/patients/" />
        </CardContent>

        <CardFooter>
          <DataTablePagination table={table} />
        </CardFooter>
      </Card>
    </FadeIn>
  );
}
