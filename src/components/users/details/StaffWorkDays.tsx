import { Badge } from "@/components/badge";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/description-list";
import { Subheading } from "@/components/heading";
import { WorkDay } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader } from "@ui/card";
import { format } from "date-fns";

import React, { Fragment } from "react";

type Props = {
  workday: WorkDay[];
};
export default function StaffWorkDays({ workday }: Props) {
  return (
    <div className="py-10">
      <Subheading className="pb-5">Workdays information</Subheading>
      <Card className="rounded-2xl ">
        <CardHeader></CardHeader>
        <CardContent>
          <DescriptionList>
            {workday.map((day, index) => (
              <Fragment key={index}>
                <DescriptionTerm>{day.day}</DescriptionTerm>
                <DescriptionDetails>
                  <Badge className="p-4">
                    {format(day.startTime, "p")} to {format(day.endTime, "p")}
                  </Badge>
                </DescriptionDetails>
              </Fragment>
            ))}
          </DescriptionList>
        </CardContent>

        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
