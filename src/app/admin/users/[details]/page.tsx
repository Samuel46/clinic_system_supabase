import StaffDetails from "@/components/users/details";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import React from "react";

interface Props {
  params: {
    details: string;
  };
}
async function getData(id: string) {
  const currentUser = await prisma_next.user.findUnique({
    where: { id },
    include: {
      schedule: {
        include: {
          daysOff: true,
          workDays: true,
        },
      },

      appointments: true,
      Treatment: true,
      role: true,
    },
  });

  return { currentUser };
}
export default async function UserDetailsPage({ params: { details: id } }: Props) {
  const { currentUser } = await getData(id);
  const user = await getCurrentUser();

  return (
    <StaffDetails
      id={id}
      staff={currentUser}
      user={user}
      appointments={currentUser?.appointments}
      daysoff={currentUser?.schedule?.daysOff}
      workdays={currentUser?.schedule?.workDays}
    />
  );
}
