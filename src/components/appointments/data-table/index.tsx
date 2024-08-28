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

import { AppointmentDataTable, FilterableColumn, SessionUser } from "@type/index";
import { FadeIn } from "@/components/FadeIn";

import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { supabase } from "@lib/supabase/client";
import { $Enums, Appointment, Patient, User } from "@prisma/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { fetchAppointment } from "@services/appointments.service";
import { transformAppointment } from "@utils/index";
import { fDate, fDateTime } from "@utils/formatTime";
import { useSession } from "next-auth/react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: AppointmentDataTable[];
  filterableColumns: FilterableColumn[];
  user?: SessionUser;
}

export default function AppointmentList<TData, TValue>({
  columns,
  data,
  filterableColumns,
  user,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [appointments, setAppointments] = useState<AppointmentDataTable[]>(data);

  const router = useRouter();

  const table = useReactTable({
    data: appointments as TData[],
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
    const channel = supabase
      .channel("appointment changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Appointment" },
        async (payload) => {
          const appointment = payload.new as Appointment;

          console.log(payload, "payload here@!!!!");

          if (payload) {
            // Fetch the full appointment data including the related tenant, doctor, and patient using prisma
            const fullAppointment = await fetchAppointment(
              appointment.id,
              payload.eventType
            );

            handleAppointmentUpdate(
              transformAppointment(fullAppointment, user),
              payload.eventType,
              payload
            );
          }
        }
      )
      .subscribe();

    // Cleanup the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function handleAppointmentUpdate(
    appointment: AppointmentDataTable,
    eventType: string,
    payload: RealtimePostgresChangesPayload<{
      [key: string]: any;
    }>
  ) {
    switch (eventType) {
      case "INSERT":
        if ((payload.new as Appointment).doctorId !== user?.id) {
          toast.success(
            `New appointment added by ${user?.name} for ${appointment.patient} at ${fDate(
              appointment?.createdAt ?? new Date()
            )}`,
            {
              position: "top-right",
            }
          );
        }

        // Add new appointment to the top of the list
        setAppointments((prevAppointments) => [appointment, ...prevAppointments]);
        break;
      case "UPDATE":
        if ((payload.new as Appointment).doctorId !== user?.id) {
          toast.info(
            `Appointment for ${appointment.patient} by ${
              appointment.doctor
            } at ${fDateTime(appointment.updatedAt)}.`,
            {
              // action: <Button>Approve</Button>,
              position: "top-right",
            }
          );
        }
        // Update the appointment in the list
        setAppointments((prevAppointments) =>
          prevAppointments.map((a) => (a.id === appointment.id ? appointment : a))
        );
        break;
      case "DELETE":
        if ((payload.new as Appointment).doctorId !== user?.id) {
          toast.error(
            `Appointment deleted successfully at ${fDateTime(payload.commit_timestamp)}`,
            {
              // action: <Button>Approve</Button>,
              position: "top-right",
            }
          );
        }
        // Remove the appointment from the list
        setAppointments((prevAppointments) =>
          prevAppointments.filter((a) => a.id !== (payload.old as { id: string }).id)
        );
        break;
      default:
        break;
    }
  }
  return (
    <FadeIn className=" space-y-6">
      <DynamicBreadcrumb />
      <div className="flex items-center bg-muted/70 p-8 py-10 rounded-2xl">
        <DataTableToolbar
          filterableColumns={filterableColumns}
          placeholderText="Filter patient..."
          table={table}
          filter="patient"
        />
        <div className="ml-auto flex items-center gap-2">
          <DataTableViewOptions table={table} />

          <Button
            size="sm"
            className="h-8 gap-1"
            onClick={() => router.push("appointments/create")}
          >
            <PlusCircleIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add appointment
            </span>
          </Button>
        </div>
      </div>

      <Card className=" rounded-2xl">
        <CardHeader>
          <CardTitle>Appointment</CardTitle>
          <CardDescription>
            Overview of all your appointment. Possible to view and edit from here
          </CardDescription>
        </CardHeader>

        <CardContent>
          <DataTable table={table} columns={columns} link="/admin/appointments/" />
        </CardContent>

        <CardFooter>
          <DataTablePagination table={table} />
        </CardFooter>
      </Card>
    </FadeIn>
  );
}
