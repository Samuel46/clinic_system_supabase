"use client";

import React from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@ui/button";

import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { Input } from "@ui/input";
import { GradientBackground } from "@ui/gradient";

interface FilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns: { id: string; title: string; options: FilterOption[] }[];
  placeholderText?: string;
  filter?: string;
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns,
  placeholderText = "Filter...",
  filter,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between ">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={placeholderText}
          value={(table.getColumn(filter || "name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filter || "name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {filterableColumns.map(
          (column) =>
            table.getColumn(column.id) && (
              <DataTableFacetedFilter
                key={column.id}
                column={table.getColumn(column.id)}
                title={column.title}
                options={column.options}
              />
            )
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
