import { Badge } from "@/components/badge";
import { Subheading } from "@/components/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { Patient, Prisma } from "@prisma/client";
import { Button } from "@ui/button";

import { fDate } from "@utils/formatTime";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  prescriptions: Prisma.PrescriptionGetPayload<{
    include: {
      medication: true;
    };
  }>[];
  patient: Patient | null;
}

export default function PatientPrescriptions({ prescriptions, patient }: Props) {
  const router = useRouter();
  return (
    <div className="py-10">
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Subheading>Prescription Information</Subheading>
        <div className="flex gap-4">
          <Button
            onClick={() => router.push(`/admin/patients/prescription?id=${patient?.id}`)}
          >
            Add Prescription
          </Button>
        </div>
      </div>

      <Table
        striped
        className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]"
      >
        <TableHead>
          <TableRow>
            <TableHeader>Medication</TableHeader>
            <TableHeader>Dosage</TableHeader>
            <TableHeader>Frequency</TableHeader>
            <TableHeader>Duration</TableHeader>
            <TableHeader>Instructions</TableHeader>
            <TableHeader>Prescribed At</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {prescriptions.length > 0 ? (
            prescriptions.map((prescription) => (
              <TableRow
                key={prescription.id}
                title={`${prescription.id}`}
                href={`/admin/patients/prescription?id=${prescription.patientId}&prescriptionId=${prescription.id}`}
              >
                <TableCell>{prescription.medication.name}</TableCell>
                <TableCell>{prescription.dosage}</TableCell>
                <TableCell>{prescription.frequency}</TableCell>
                <TableCell>{prescription.duration}</TableCell>
                <TableCell>{prescription.instructions || "N/A"}</TableCell>
                <TableCell>{fDate(prescription.createdAt)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No prescriptions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
