import prisma_next from "@lib/db";
import { MedicalRecord } from "@prisma/client";
import {
  CreateMedicalRecordInput,
  UpdateMedicalRecordInput,
} from "@schemas/medicalRecord.schemas";

export const createMedicalRecord = async (data: CreateMedicalRecordInput) => {
  return await prisma_next.$transaction(async (tx) => {
    const medicalRecord = await tx.medicalRecord.create({
      data,
    });

    return medicalRecord;
  });
};

export const getMedicalRecordById = async (id: string) => {
  const medicalRecord = await prisma_next.medicalRecord.findUnique({
    where: { id },
    include: {
      tenant: true,
      patient: true,
      doctor: true,
    },
  });

  return medicalRecord;
};

export const getMedicalRecordsByTenant = async (tenantId: string) => {
  const medicalRecords = await prisma_next.medicalRecord.findMany({
    where: { tenantId },
    include: {
      tenant: true,
      patient: true,
      doctor: true,
    },
  });

  return medicalRecords;
};

export const updateMedicalRecord = async (
  id: string,
  data: UpdateMedicalRecordInput
): Promise<MedicalRecord> => {
  return await prisma_next.medicalRecord.update({ where: { id }, data });
};

export const deleteMedicalRecord = async (id: string): Promise<MedicalRecord> => {
  return await prisma_next.medicalRecord.delete({ where: { id } });
};
