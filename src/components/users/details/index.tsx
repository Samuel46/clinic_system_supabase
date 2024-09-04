"use client";
import { Button } from "@ui/button";
import { Tabs, TabsList, TabsTrigger } from "@ui/tabs";
import React, { useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { Appointment, DayOff, Role, User, WorkDay } from "@prisma/client";
import { Avatar } from "@/components/avatar";
import { getInitials } from "@utils/index";

import Image from "next/image";
import { SessionUser } from "@type/index";
import { TabsContent } from "@radix-ui/react-tabs";
import StaffAppointments from "./StaffAppointments";
import StaffInfo from "./StaffInfo";
import StaffWorkDays from "./StaffWorkDays";
import StaffDaysOff from "./StaffDaysOff";

type Props = {
  id: string;
  staff: (User & { role: Role }) | null;
  appointments?: Appointment[];
  workdays?: WorkDay[];
  daysoff?: DayOff[];
  user?: SessionUser;
};
export default function StaffDetails({
  id,
  staff,
  appointments,
  user,
  workdays,
  daysoff,
}: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();

  const currentTab = searchParams?.get("tab");

  const [tab, setTab] = useState<string>("appointments");

  return (
    <div>
      <Image
        alt=""
        width={1080}
        height={1000}
        src="https://assets.lummi.ai/assets/QmXiErF625AcDoWumZwjg1VPUUbzonb93PFXp7fEadQX3T?auto=format&w=1500"
        className="h-32 w-full object-cover lg:h-48 rounded-2xl"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 ">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <Avatar
              square
              initials={getInitials(staff?.name ?? "")}
              className="size-24 sm:h-32 sm:w-32 bg-zinc-900 text-white dark:bg-white dark:text-black ring-4 ring-white"
            />
          </div>
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
              <h1 className="truncate text-2xl font-bold text-gray-900">{staff?.name}</h1>
            </div>
            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                variant="outline"
                disabled={user?.role !== "Admin" && user?.role !== "Clinic"}
                onClick={() => router.push(`/admin/users/edit?id=${id}`)}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
          <h1 className="truncate text-2xl font-bold text-gray-900">{staff?.name}</h1>
        </div>
      </div>

      <div className=" pb-5 sm:pb-0">
        <div className="mt-3 sm:mt-4">
          <div className="hidden sm:block">
            <Tabs defaultValue={tab} className="w-full">
              <TabsList>
                <TabsTrigger value="appointments">Appointment history</TabsTrigger>
                <TabsTrigger value="info">Staff information</TabsTrigger>
                <TabsTrigger value="workday">WorkDays</TabsTrigger>
                <TabsTrigger value="dayoff">DayOff</TabsTrigger>
              </TabsList>
              <TabsContent value="appointments">
                <StaffAppointments appointments={appointments ?? []} />
              </TabsContent>
              <TabsContent value="info">
                <StaffInfo staff={staff} />
              </TabsContent>

              <TabsContent value="workday">
                <StaffWorkDays workday={workdays ?? []} />
              </TabsContent>

              <TabsContent value="dayoff">
                <StaffDaysOff daysoff={daysoff ?? []} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
