import { Badge } from "@/components/badge";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/description-list";
import { Subheading } from "@/components/heading";
import { DayOff } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader } from "@ui/card";
import { format } from "date-fns";

import React, { Fragment } from "react";

type Props = {
  daysoff: DayOff[];
};
export default function StaffDaysOff({ daysoff }: Props) {
  return (
    <div className="py-10">
      <Subheading className="pb-5">Workdays information</Subheading>
      <Card className="rounded-2xl ">
        <CardHeader></CardHeader>
        <CardContent>
          <DescriptionList>
            {daysoff.map((day, index) => (
              <Fragment key={index}>
                <DescriptionTerm>{day.name}</DescriptionTerm>
                <DescriptionDetails>
                  <Badge className="p-4">
                    {format(day.date, "PPP")} - {day.reason}
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
