"use client";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/description-list";
import { Heading, Subheading } from "@/components/heading";
import { AppointmentStatus, Prisma } from "@prisma/client";
import { Button } from "@ui/button";
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/badge";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import AppointmentSteps from "./AppointmentSteps";

type Props = {
  appointment: Prisma.AppointmentGetPayload<{
    include: {
      patient: true;
      doctor: true;
      medicalCheckup: true;
      treatment: true;
      medicalRecord: true;
    };
  }> | null;
};

export default function AppointmentDetails({ appointment }: Props) {
  const router = useRouter();
  return (
    <div>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Appointment details</Heading>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push(`/admin/appointments/edit?id=${appointment?.id}`)}
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="space-y-6 mt-10">
        <DynamicBreadcrumb />

        <AppointmentSteps
          id={appointment?.id ?? ""}
          currentCheckup={appointment?.medicalCheckup}
          currentMedicalRecord={appointment?.medicalRecord}
          currentTreatment={appointment?.treatment}
        />

        <>
          <Subheading>Patient Information</Subheading>
          <DescriptionList className="mt-4">
            <DescriptionTerm>Full Name</DescriptionTerm>
            <DescriptionDetails>{appointment?.patient.name}</DescriptionDetails>

            <DescriptionTerm>Email</DescriptionTerm>
            <DescriptionDetails>{appointment?.patient.email}</DescriptionDetails>

            <DescriptionTerm>Phone</DescriptionTerm>
            <DescriptionDetails>{appointment?.patient.phone}</DescriptionDetails>

            <DescriptionTerm>Address</DescriptionTerm>
            <DescriptionDetails>{appointment?.patient.address}</DescriptionDetails>

            <DescriptionTerm>Date of Birth</DescriptionTerm>
            <DescriptionDetails>
              {format(appointment?.patient.dateOfBirth ?? new Date(), "PPP")}
            </DescriptionDetails>

            <DescriptionTerm>Medical History</DescriptionTerm>
            <DescriptionDetails>{appointment?.patient.medicalHistory}</DescriptionDetails>
          </DescriptionList>
        </>

        <>
          <Subheading>Appointment Information</Subheading>
          <DescriptionList>
            <DescriptionTerm>Doctor</DescriptionTerm>
            <DescriptionDetails>{appointment?.doctor.name}</DescriptionDetails>

            <DescriptionTerm>Time</DescriptionTerm>
            <DescriptionDetails>
              {format(appointment?.startTime ?? new Date(), "p")} to{" "}
              {format(appointment?.endTime ?? new Date(), "p")}
            </DescriptionDetails>

            <DescriptionTerm>Reason</DescriptionTerm>
            <DescriptionDetails>{appointment?.reason}</DescriptionDetails>

            <DescriptionTerm>Status</DescriptionTerm>
            <DescriptionDetails>
              <Badge
                className="max-w-[250px] truncate font-medium text-pretty"
                color={
                  appointment?.status === AppointmentStatus.SCHEDULED
                    ? "sky"
                    : appointment?.status === AppointmentStatus.COMPLETED
                    ? "green"
                    : "red"
                }
              >
                {appointment?.status}
              </Badge>
            </DescriptionDetails>

            <DescriptionTerm>Created At</DescriptionTerm>
            <DescriptionDetails>
              {format(appointment?.createdAt ?? new Date(), "PPP p")}
            </DescriptionDetails>

            <DescriptionTerm>Updated At</DescriptionTerm>
            <DescriptionDetails>
              {format(appointment?.updatedAt ?? new Date(), "PPP p")}
            </DescriptionDetails>
          </DescriptionList>
        </>
      </div>

      <div className="flex flex-shrink-0 justify-end px-4 py-4">
        <Button
          className=" font-semibold p-6"
          type="submit"
          onClick={() =>
            router.push(`/admin/appointments/check-up?id=${appointment?.id}`)
          }
        >
          Medical checkup
          <ChevronRight className=" size-5" />
        </Button>
      </div>
    </div>
  );
}
