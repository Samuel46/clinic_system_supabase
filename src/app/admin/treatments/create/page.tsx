import { TreatmentInfoForm } from "@/components/treatment";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { SessionUser } from "@type/index";
import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

async function getData(id: string) {
  // const whereClause = user?.role !== "Admin" ? { tenantId: user?.tenantId } : {};
  let currentTreatment;

  if (id) {
    const treatment = await prisma_next.treatment.findUnique({
      where: {
        id,
      },
    });

    currentTreatment = treatment;
  }

  return { currentTreatment };
}

export default async function TreatmentPage({ searchParams: { id } }: Props) {
  const user = await getCurrentUser();

  const { currentTreatment } = await getData(id);

  return <TreatmentInfoForm user={user} currentTreatment={currentTreatment ?? null} />;
}
