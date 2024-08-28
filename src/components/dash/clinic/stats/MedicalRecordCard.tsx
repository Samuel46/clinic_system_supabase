import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";

import { format, subWeeks } from "date-fns";
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

async function fetchMedicalRecordsData(user?: SessionUser) {
  const tenantFilter: Prisma.MedicalRecordWhereInput =
    user?.role !== "Admin" ? { tenantId: user?.tenantId } : {};

  const records = await prisma_next.medicalRecord.findMany({
    where: tenantFilter,
    orderBy: {
      updatedAt: "desc",
    },
  });

  const totalRecords = records.length;
  const newRecordsThisWeek = records.filter(
    (record) => record.createdAt > subWeeks(new Date(), 1)
  ).length;
  const lastUpdated = records.length > 0 ? records[0].updatedAt : null;

  return {
    totalRecords,
    newRecordsThisWeek,
    lastUpdated,
  };
}

export default async function MedicalRecordsCard() {
  const user = await getCurrentUser();
  const { totalRecords, newRecordsThisWeek, lastUpdated } = await fetchMedicalRecordsData(
    user
  );
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Medical Records</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalRecords} Records</div>
        <DescriptionList>
          <DescriptionTerm>This week:</DescriptionTerm>
          <DescriptionDetails className=" text-sm">
            <Badge className=" text-sm" color={newRecordsThisWeek < 0 ? "rose" : "lime"}>
              {newRecordsThisWeek < 0 ? "-" : "+"}
              {newRecordsThisWeek}
            </Badge>
          </DescriptionDetails>
          <DescriptionTerm>Updated:</DescriptionTerm>
          <DescriptionDetails>
            <Badge>{lastUpdated ? fDate(lastUpdated) : "N/A"}</Badge>
          </DescriptionDetails>
          <DescriptionTerm>Time updated:</DescriptionTerm>

          <DescriptionDetails>
            <Badge> {lastUpdated ? format(lastUpdated, "p") : "N/A"}</Badge>
          </DescriptionDetails>
        </DescriptionList>
      </CardContent>
    </Card>
  );
}
