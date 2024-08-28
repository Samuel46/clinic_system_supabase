import React, { ChangeEvent } from "react";

import { Table } from "@tanstack/react-table";
import { Input } from "@/components/input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  title: string;
  desc: string;
  name: string;
}

export default function Toolbar<TData>({
  table,
  title,
  desc,
  name,
}: DataTableToolbarProps<TData>) {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-700">{desc}</p>
        </div>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder={`Filter ${name}...`}
          value={(table.getColumn(name)?.getFilterValue() as string) ?? ""}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            table.getColumn(name)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
    </div>
  );
}
