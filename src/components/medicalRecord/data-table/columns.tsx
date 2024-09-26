"use client";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/description-list";
import { MedicalCheckup, Treatment } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MedicalRecordColumns } from "@type/index";
import { DataTableColumnHeader } from "@ui/table/DataTableColumnHeade";
import { fDate } from "@utils/formatTime";

import MedicalRecordAction from "./MedicalRecordAction";

export const medicalRecordColumns: ColumnDef<MedicalRecordColumns>[] = [
  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => (
      <p className="font-medium text-gray-900">{row.getValue("patient")}</p>
    ),

    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "doctor",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Doctor" />,
    cell: ({ row }) => <p>{row.getValue("doctor")}</p>,

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
      const treatments: Treatment[] = row.getValue("treatment");
      return treatments.length ? (
        <ul role="list" className="space-y-3">
          {treatments.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-md bg-white px-6 py-4 shadow"
            >
              {item.name}
            </li>
          ))}
        </ul>
      ) : (
        "N/A"
      );
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
