import prisma_next from "@lib/db";
import {
  CreatePrescriptionInput,
  UpdatePrescriptionInput,
} from "@schemas/prescriptions.schemas";

export const createPrescription = async (data: CreatePrescriptionInput) => {
  return await prisma_next.prescription.create({
    data,
  });
};

export const updatePrescription = async (id: string, data: UpdatePrescriptionInput) => {
  return await prisma_next.prescription.update({
    where: { id },
    data,
  });
};

export const deletePrescription = async (id: string) => {
  return await prisma_next.prescription.delete({
    where: { id },
  });
};

export const getPrescriptionById = async (id: string) => {
  return await prisma_next.prescription.findUnique({
    where: { id },
  });
};
