import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/description-list";
import { Subheading } from "@/components/heading";
import { Patient } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@ui/card";
import { fDate } from "@utils/formatTime";
import React from "react";

type Props = {
  patient: Patient | null;
};
export default function PatientInfo({ patient }: Props) {
  return (
    <div className="py-10">
      <Card className=" rounded-2xl ">
        <CardHeader>
          <Subheading>Patient information</Subheading>
        </CardHeader>
        <CardContent>
          <DescriptionList>
            <DescriptionTerm>Full name</DescriptionTerm>
            <DescriptionDetails>{patient?.name}</DescriptionDetails>

            <DescriptionTerm>Email address</DescriptionTerm>
            <DescriptionDetails>{patient?.email}</DescriptionDetails>

            <DescriptionTerm>Phone number</DescriptionTerm>
            <DescriptionDetails>{patient?.phone}</DescriptionDetails>

            <DescriptionTerm>Date of Birth</DescriptionTerm>
            <DescriptionDetails>
              {fDate(patient?.dateOfBirth ?? new Date())}
            </DescriptionDetails>

            <DescriptionTerm>Medical history</DescriptionTerm>
            <DescriptionDetails>{patient?.medicalHistory}</DescriptionDetails>

            <DescriptionTerm>Address</DescriptionTerm>
            <DescriptionDetails>{patient?.address}</DescriptionDetails>

            <DescriptionTerm>Registered on</DescriptionTerm>
            <DescriptionDetails>
              {fDate(patient?.createdAt ?? new Date())}
            </DescriptionDetails>
          </DescriptionList>
        </CardContent>
      </Card>
    </div>
  );
}
