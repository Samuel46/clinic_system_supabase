import { AddEquipmentForm } from "@/components/treatment/addEquipments";
import prisma_next from "@lib/db";
import React from "react";

interface Props {
  searchParams: {
    id: string;
  };
}

async function getData(id?: string) {
  let treatment;

  if (id) {
    treatment = await prisma_next.treatment.findUnique({
      where: {
        id,
      },
      include: {
        treatmentEquipments: true,
      },
    });
  }

  const equipments = await prisma_next.component.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return { treatment, equipments };
}
export default async function AddEquipmentPage({ searchParams: { id } }: Props) {
  const { treatment, equipments } = await getData(id);

  return (
    <AddEquipmentForm
      currentTreatment={treatment ?? null}
      equipments={equipments}
      edit={Boolean(treatment?.treatmentEquipments.length)}
    />
  );
}
