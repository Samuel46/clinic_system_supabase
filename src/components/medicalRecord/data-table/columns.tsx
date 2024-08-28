"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MedicalRecordColumns } from "@type/index";
import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";

import MedicalRecordAction from "./MedicalRecordAction";
import { fDate } from "@utils/formatTime";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/description-list";
import { MedicalCheckup, Treatment } from "@prisma/client";

export const medicalRecordColumns: ColumnDef<MedicalRecordColumns>[] = [
  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("patient")}</div>,

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "doctor",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Doctor" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("doctor")}</div>,

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "checkup",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Checkup" />,
    cell: ({ row }) => {
      const checkups: MedicalCheckup = row.getValue("checkup");
      return (
        <DescriptionList className=" w-[400px]">
          <DescriptionTerm>Blood Pressure</DescriptionTerm>
          <DescriptionDetails>{checkups?.bloodPressure}</DescriptionDetails>

          <DescriptionTerm>Heart Rate</DescriptionTerm>
          <DescriptionDetails>{checkups?.heartRate} bpm</DescriptionDetails>

          {checkups?.respiratoryRate && (
            <>
              <DescriptionTerm>Respiratory Rate</DescriptionTerm>
              <DescriptionDetails>{checkups?.respiratoryRate} bpm</DescriptionDetails>
            </>
          )}

          {checkups?.temperature && (
            <>
              <DescriptionTerm>Temperature</DescriptionTerm>
              <DescriptionDetails>{checkups?.temperature} °F</DescriptionDetails>
            </>
          )}

          {checkups?.oxygenSaturation && (
            <>
              <DescriptionTerm>Oxygen Saturation</DescriptionTerm>
              <DescriptionDetails>{checkups?.oxygenSaturation} %</DescriptionDetails>
            </>
          )}

          {checkups?.weight && (
            <>
              <DescriptionTerm>Weight</DescriptionTerm>
              <DescriptionDetails>{checkups?.weight} kg</DescriptionDetails>
            </>
          )}

          {checkups?.height && (
            <>
              <DescriptionTerm>Height</DescriptionTerm>
              <DescriptionDetails>{checkups?.height} cm</DescriptionDetails>
            </>
          )}

          {checkups?.bmi && (
            <>
              <DescriptionTerm>BMI</DescriptionTerm>
              <DescriptionDetails>{checkups?.bmi}</DescriptionDetails>
            </>
          )}
        </DescriptionList>
      );
    },
  },

  {
    accessorKey: "treatment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Treatment type" />
    ),
    cell: ({ row }) => {
      const treatment: Treatment = row.getValue("treatment");
      return <div className="font-medium">{treatment.type}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => (
      <div className="font-medium">{fDate(new Date(row.getValue("createdAt")))}</div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <MedicalRecordAction row={row} />,
  },
];
