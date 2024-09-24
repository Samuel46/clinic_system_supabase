"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { FadeIn } from "@/components/FadeIn";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
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
import { FilterableColumn } from "@type/index";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/card";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { DataTablePagination } from "@ui/table/DataTablePagination";
import { DataTableToolbar } from "@ui/table/DataTableToolbar";
import { DataTableViewOptions } from "@ui/table/DataTableViewOptions";
import { DataTable } from "@ui/table/index";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	filterableColumns: FilterableColumn[];
}

export default function MedicalRecordList<TData, TValue>({ columns, data, filterableColumns }: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);

	const router = useRouter();

	const table = useReactTable({
		data,
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
			<DynamicBreadcrumb />
			<div className="flex items-center bg-muted/70 p-8 py-10 rounded-2xl">
				<DataTableToolbar
					filterableColumns={filterableColumns}
					placeholderText="Filter record..."
					filter="record"
					table={table}
				/>
				<div className="ml-auto flex items-center gap-2">
					<DataTableViewOptions table={table} />
				</div>
			</div>

			<Card className=" rounded-2xl">
				<CardHeader>
					<CardTitle>Medical records</CardTitle>
					<CardDescription>Overview of all your medical record. Possible to view and edit from here</CardDescription>
				</CardHeader>

				<CardContent>
					<DataTable table={table} columns={columns} link="/admin/medical-records/" />
				</CardContent>

				<CardFooter>
					<DataTablePagination table={table} />
				</CardFooter>
			</Card>
		</FadeIn>
	);
}
