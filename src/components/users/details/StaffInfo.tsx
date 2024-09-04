import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/description-list";
import { Subheading } from "@/components/heading";
import { Role, User } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader } from "@ui/card";
import { fDate } from "@utils/formatTime";
import { CheckIcon } from "lucide-react";
import React from "react";

type Props = {
  staff: (User & { role: Role }) | null;
};
export default function StaffInfo({ staff }: Props) {
  return (
    <div className="py-10">
      <Subheading className="pb-5">Staff information</Subheading>
      <Card className="rounded-2xl ">
        <CardHeader></CardHeader>
        <CardContent>
          <DescriptionList>
            <DescriptionTerm>Full name</DescriptionTerm>
            <DescriptionDetails>{staff?.name}</DescriptionDetails>

            <DescriptionTerm>Email address</DescriptionTerm>
            <DescriptionDetails>{staff?.email}</DescriptionDetails>

            <DescriptionTerm>Phone number</DescriptionTerm>
            <DescriptionDetails>{staff?.phone ? staff.phone : "N/A"}</DescriptionDetails>

            <DescriptionTerm>Role</DescriptionTerm>
            <DescriptionDetails>
              {staff?.role.name ? staff.role.name : "N/A"}
            </DescriptionDetails>

            <DescriptionTerm>Registered on</DescriptionTerm>
            <DescriptionDetails>
              {fDate(staff?.createdAt ?? new Date())}
            </DescriptionDetails>
          </DescriptionList>
        </CardContent>

        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}
