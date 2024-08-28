import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";

import { format } from "date-fns";
import prisma_next from "@lib/db";
import { fDate } from "@utils/formatTime";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/description-list";
import { Badge } from "@/components/badge";
import { SessionUser } from "@type/index";
import { getCurrentUser } from "@lib/session";

type AppointmentsData = {
  upcomingAppointments: number;
  completedAppointments: number;
  nextAppointment: Date | null;
  nextAppointmentTime: string | null;
};

async function fetchAppointmentsData(user?: SessionUser): Promise<AppointmentsData> {
  const tenantFilter = user?.role !== "Admin" ? { tenantId: user?.tenantId } : {};
  const now = new Date();

  // Fetch the count of upcoming appointments (scheduled but not yet completed)
  const upcomingAppointments = await prisma_next.appointment.count({
    where: {
      ...tenantFilter,
      status: "SCHEDULED", // Only consider scheduled appointments
      date: {
        lte: now, // Appointments today or in the future
      },
    },
  });

  // Fetch the count of completed appointments
  const completedAppointments = await prisma_next.appointment.count({
    where: {
      ...tenantFilter,
      status: "COMPLETED", // Only consider completed appointments
      date: {
        lt: now, // Any appointment before the current time
      },
    },
  });

  // Fetch the next appointment (the closest upcoming appointment)
  const nextAppointment = await prisma_next.appointment.findFirst({
    where: {
      ...tenantFilter,
      status: "SCHEDULED", // Only consider scheduled appointments
      date: {
        lte: now, // Appointments today or in the future
      },
    },
    orderBy: {
      date: "asc",
    },
    select: {
      date: true, // Start date
      startTime: true, // Start time
      endTime: true, // End time
    },
  });

  return {
    upcomingAppointments,
    completedAppointments,
    nextAppointment: nextAppointment ? nextAppointment.date : null,
    nextAppointmentTime: nextAppointment
      ? `${format(nextAppointment.startTime, "p")} to ${format(
          nextAppointment.endTime,
          "p"
        )}`
      : null,
  };
}

export default async function AppointmentsCard() {
  const user = await getCurrentUser();
  const {
    upcomingAppointments,
    completedAppointments,
    nextAppointment,
    nextAppointmentTime,
  } = await fetchAppointmentsData(user);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Appointments</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{upcomingAppointments} Scheduled</div>

        <DescriptionList>
          <DescriptionTerm>Completed:</DescriptionTerm>
          <DescriptionDetails>
            <Badge color={"lime"}>+{completedAppointments} </Badge>
          </DescriptionDetails>

          <DescriptionTerm>Date at:</DescriptionTerm>
          <DescriptionDetails>
            <Badge>{fDate(nextAppointment) ? fDate(nextAppointment) : "N/A"}</Badge>
          </DescriptionDetails>

          <DescriptionTerm>Time at:</DescriptionTerm>
          <DescriptionDetails>
            <Badge color={"amber"}>
              {nextAppointmentTime ? nextAppointmentTime : "N/A"}
            </Badge>
          </DescriptionDetails>
        </DescriptionList>
      </CardContent>
    </Card>
  );
}
