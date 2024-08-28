import { Prisma } from "@prisma/client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { Subheading } from "@/components/heading";
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDetails,
} from "@/components/description-list";
import { fDate } from "@utils/formatTime";

type Props = {
  records: Prisma.MedicalRecordGetPayload<{
    include: {
      checkups: true;
      treatments: true;
      doctor: true;
    };
  }>[];
};

export default function PatientRecord({ records }: Props) {
  return (
    <div className="py-10">
      <Subheading>Medical Records</Subheading>
      <Table
        striped
        grid
        className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]"
      >
        <TableHead>
          <TableRow>
            <TableHeader>Doctor</TableHeader>
            <TableHeader>Checkup Details</TableHeader>
            <TableHeader>Treatment Type</TableHeader>
            <TableHeader>Follow-Up</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.length > 0 ? (
            records.map((record) => (
              <TableRow
                key={record.id}
                title={`${record.id}`}
                className=" cursor-pointer"
                href={`/admin/patients/record?id=${record.id}`}
              >
                <TableCell className="">
                  <div className=" font-medium pb-2 text-base/6">
                    {record.doctor.name}
                  </div>
                  <p className="text-zinc-500 "> {fDate(record.visitDate)}</p>
                </TableCell>

                <TableCell>
                  {record.checkups ? (
                    <DescriptionList>
                      <DescriptionTerm>Blood Pressure</DescriptionTerm>
                      <DescriptionDetails>
                        {record.checkups.bloodPressure}
                      </DescriptionDetails>

                      <DescriptionTerm>Heart Rate</DescriptionTerm>
                      <DescriptionDetails>
                        {record.checkups.heartRate} bpm
                      </DescriptionDetails>

                      {record.checkups.respiratoryRate && (
                        <>
                          <DescriptionTerm>Respiratory Rate</DescriptionTerm>
                          <DescriptionDetails>
                            {record.checkups.respiratoryRate} bpm
                          </DescriptionDetails>
                        </>
                      )}

                      {record.checkups.temperature && (
                        <>
                          <DescriptionTerm>Temperature</DescriptionTerm>
                          <DescriptionDetails>
                            {record.checkups.temperature} °F
                          </DescriptionDetails>
                        </>
                      )}

                      {record.checkups.oxygenSaturation && (
                        <>
                          <DescriptionTerm>Oxygen Saturation</DescriptionTerm>
                          <DescriptionDetails>
                            {record.checkups.oxygenSaturation} %
                          </DescriptionDetails>
                        </>
                      )}

                      {record.checkups.weight && (
                        <>
                          <DescriptionTerm>Weight</DescriptionTerm>
                          <DescriptionDetails>
                            {record.checkups.weight} kg
                          </DescriptionDetails>
                        </>
                      )}

                      {record.checkups.height && (
                        <>
                          <DescriptionTerm>Height</DescriptionTerm>
                          <DescriptionDetails>
                            {record.checkups.height} cm
                          </DescriptionDetails>
                        </>
                      )}

                      {record.checkups.bmi && (
                        <>
                          <DescriptionTerm>BMI</DescriptionTerm>
                          <DescriptionDetails>{record.checkups.bmi}</DescriptionDetails>
                        </>
                      )}
                    </DescriptionList>
                  ) : (
                    "N/A"
                  )}
                </TableCell>

                <TableCell>
                  {record.treatments ? (
                    <>
                      <p className="text-zinc-950 text-base/6">
                        {record.treatments.type}
                      </p>
                    </>
                  ) : (
                    "N/A"
                  )}
                </TableCell>

                <TableCell>{record.followUp}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No medical records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
