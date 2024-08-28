import prisma_next from "@lib/db";
import { Treatment } from "@prisma/client";
import { CreateTreatmentInput, UpdateTreatmentInput } from "@schemas/treament.schemas";

export const createTreatment = async (data: CreateTreatmentInput): Promise<Treatment> => {
  return prisma_next.treatment.create({
    data,
  });
};

export const updateTreatment = async (
  id: string,
  data: UpdateTreatmentInput
): Promise<Treatment> => {
  return prisma_next.treatment.update({
    where: { id },
    data,
  });
};

export const deleteTreatment = async (id: string): Promise<Treatment> => {
  return prisma_next.treatment.delete({
    where: { id },
  });
};

export const getTreatmentById = async (id: string): Promise<Treatment | null> => {
  return prisma_next.treatment.findUnique({
    where: { id },
  });
};

export const getAllTreatments = async (): Promise<Treatment[]> => {
  return prisma_next.treatment.findMany();
};
