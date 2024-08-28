import prisma_next from "@lib/db";
import {
  CreateMedicalCheckupInput,
  UpdateMedicalCheckupInput,
} from "@schemas/checkup.schemas";

export async function createMedicalCheckup(data: CreateMedicalCheckupInput) {
  return await prisma_next.medicalCheckup.create({ data });
}

export async function getMedicalCheckupById(id: string) {
  return await prisma_next.medicalCheckup.findUnique({ where: { id } });
}

export async function updateMedicalCheckup(id: string, data: UpdateMedicalCheckupInput) {
  return await prisma_next.medicalCheckup.update({ where: { id }, data });
}

export async function deleteMedicalCheckup(id: string) {
  return await prisma_next.medicalCheckup.delete({ where: { id } });
}
