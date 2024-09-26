"use client";

import { ColumnDef, flexRender, Table as Ttable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/table";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: Ttable<TData>;
  link?: string;
  disableRowClick?: boolean;
}

export default function DataTable<TData, TValue>({
  table,
  columns,
  link,
  disableRowClick = false,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();

  const handleRowClick = (id?: string) => {
    if (link) {
      router.push(`${link}/${id}`);
    }
  };

  return (
    <div className="z-10">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const original = row.original as unknown as TData & { id: string };
              return (
                <TableRow
                  className={!disableRowClick ? "cursor-pointer" : ""}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => !disableRowClick && handleRowClick(original.id)}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => {
                    const isLastCell = cellIndex === row.getVisibleCells().length - 1;
                    return (
                      <TableCell
                        key={cell.id}
                        onClick={(e) => {
                          if (isLastCell) {
                            e.stopPropagation();
                          }
                        }}
                        className={!isLastCell ? "cursor-pointer " : ""}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
