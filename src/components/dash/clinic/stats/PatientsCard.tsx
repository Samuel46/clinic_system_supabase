import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";

import { subMonths } from "date-fns";
import prisma_next from "@lib/db";
import { fDate } from "@utils/formatTime";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/description-list";
import { Badge } from "@/components/badge";
import { SessionUser } from "@type/index";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@lib/session";

type PatientsData = {
  totalPatients: number;
  newPatientsThisMonth: number;
  lastPatientAdded: Date | null;
};
async function fetchPatientsData(user?: SessionUser): Promise<PatientsData> {
  // Define the whereClause based on the user's role
  const whereClause: Prisma.PatientWhereInput =
    user?.role === "Admin" ? {} : { tenantId: user?.tenantId };

  // Fetch the total number of patients
  const totalPatients = await prisma_next.patient.count({
    where: whereClause,
  });

  // Fetch the number of new patients added this month
  const newPatientsThisMonth = await prisma_next.patient.count({
    where: {
      ...whereClause,
      createdAt: {
        gte: subMonths(new Date(), 1),
      },
    },
  });

  // Fetch the most recently added patient
  const lastPatient = await prisma_next.patient.findFirst({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    totalPatients,
    newPatientsThisMonth,
    lastPatientAdded: lastPatient ? lastPatient.createdAt : null,
  };
}

export default async function PatientsCard() {
  const user = await getCurrentUser();
  const { totalPatients, newPatientsThisMonth, lastPatientAdded } =
    await fetchPatientsData(user);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Patients</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalPatients} Total Patients</div>

        <DescriptionList>
          <DescriptionTerm>This month:</DescriptionTerm>
          <DescriptionDetails>
            {" "}
            <Badge color={"lime"}>+{newPatientsThisMonth}</Badge>
          </DescriptionDetails>

          <DescriptionTerm>Last added:</DescriptionTerm>
          <DescriptionDetails>
            <Badge color={"amber"}>
              {lastPatientAdded ? fDate(lastPatientAdded) : "N/A"}
            </Badge>
          </DescriptionDetails>
        </DescriptionList>
      </CardContent>
    </Card>
  );
}
