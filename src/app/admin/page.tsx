import { RecentAppointments } from "@/components/dash/clinic";
import {
  BillsCard,
  ClinicSkeleton,
  MedicalRecordsCard,
  PatientsCard,
} from "@/components/dash/clinic/stats";
import AppointmentsCard from "@/components/dash/clinic/stats/AppointmentsCard";

import { RecentSalesSkeleton } from "@/components/dash/pharmacy";

import { Heading, Subheading } from "@/components/heading";

import { getCurrentUser } from "@lib/session";

import React, { Suspense } from "react";

type GreetingProps = {
  userName: string;
};

const Greeting: React.FC<GreetingProps> = ({ userName }) => {
  const currentHour = new Date().getHours();

  let greeting = "Hello";

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18 && currentHour < 22) {
    greeting = "Good evening";
  } else {
    greeting = "Good night";
  }

  return (
    <Heading>
      {greeting}, {userName}
    </Heading>
  );
};
export default async function page() {
  const user = await getCurrentUser();

  return (
    <div className=" space-y-6">
      <Greeting userName={user?.name ?? ""} />
      <div className="mt-8 flex items-end justify-between">
        <Subheading>Overview</Subheading>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Suspense fallback={<ClinicSkeleton />}>
          <BillsCard />
        </Suspense>
        <Suspense fallback={<ClinicSkeleton />}>
          <MedicalRecordsCard />
        </Suspense>

        <Suspense fallback={<ClinicSkeleton />}>
          <AppointmentsCard />
        </Suspense>

        <Suspense fallback={<ClinicSkeleton />}>
          <PatientsCard />
        </Suspense>
      </div>

      <Suspense fallback={<RecentSalesSkeleton />}>
        <RecentAppointments />
      </Suspense>
    </div>
  );
}
