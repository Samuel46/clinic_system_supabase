"use client";
import { Button } from "@ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import React, { useState } from "react";
import PatientInfo from "./PatientInfo";
import PatientBills from "./PatientBills";
import PatientAppointments from "./PatientAppointments";
import { useRouter, useSearchParams } from "next/navigation";
import { Patient, Prisma } from "@prisma/client";
import { Avatar } from "@/components/avatar";
import { getInitials } from "@utils/index";
import PatientPrescriptions from "./PatientPrescriptions";
import PatientRecord from "./PatientRecord";

import Image from "next/image";
import { SessionUser } from "@type/index";

type Props = {
  id: string;
  patient: Patient | null;
  appointments: Prisma.AppointmentGetPayload<{
    include: {
      doctor: true;
    };
  }>[];
  bills: Prisma.BillingGetPayload<{
    include: { user: true };
  }>[];
  prescriptions: Prisma.PrescriptionGetPayload<{
    include: {
      medication: true;
    };
  }>[];
  medicalRecord: Prisma.MedicalRecordGetPayload<{
    include: {
      checkups: true;
      treatments: true;
      doctor: true;
    };
  }>[];
  user?: SessionUser;
};
export default function PatientDetails({
  id,
  patient,
  appointments,
  bills,
  prescriptions,
  medicalRecord,
  user,
}: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const currentTab = searchParams?.get("tab");

  const [tab, setTab] = useState<string>("appointments");

  return (
    <div>
      <div>
        <Image
          alt=""
          width={1080}
          height={1000}
          src="https://assets.lummi.ai/assets/QmXiErF625AcDoWumZwjg1VPUUbzonb93PFXp7fEadQX3T?auto=format&w=1500"
          className="h-32 w-full object-cover lg:h-48 rounded-2xl"
        />
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 ">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <Avatar
              square
              initials={getInitials(patient?.name ?? "")}
              className="size-24 sm:h-32 sm:w-32 bg-zinc-900 text-white dark:bg-white dark:text-black ring-4 ring-white"
            />
          </div>
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
              <h1 className="truncate text-2xl font-bold text-gray-900">
                {patient?.name}
              </h1>
            </div>
            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                variant="outline"
                disabled={user?.role !== "Admin" && user?.role !== "Clinic"}
                onClick={() => router.push(`/admin/patients/edit?id=${id}`)}
              >
                Edit
              </Button>
              <Button
                className=" font-bold"
                onClick={() => router.push(`/admin/appointments/create?id=${id}`)}
              >
                Create appointment
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
          <h1 className="truncate text-2xl font-bold text-gray-900">{patient?.name}</h1>
        </div>
      </div>

      <div className=" pb-5 sm:pb-0">
        <div className="mt-3 sm:mt-4">
          <div className="hidden sm:block">
            <Tabs defaultValue={tab} className="w-full">
              <TabsList>
                <TabsTrigger value="appointments">Appointment history</TabsTrigger>
                <TabsTrigger value="info">Patient information</TabsTrigger>
                <TabsTrigger value="bill">Bills details</TabsTrigger>
                {/* <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger> */}

                <TabsTrigger value="record">Patient records</TabsTrigger>
              </TabsList>
              <TabsContent value="appointments">
                <PatientAppointments appointments={appointments} />
              </TabsContent>
              <TabsContent value="info">
                <PatientInfo patient={patient} />
              </TabsContent>

              <TabsContent value="bill">
                <PatientBills bills={bills} patient={patient} user={user} />
              </TabsContent>

              <TabsContent value="prescriptions">
                <PatientPrescriptions patient={patient} prescriptions={prescriptions} />
              </TabsContent>

              <TabsContent value="record">
                <PatientRecord records={medicalRecord} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
