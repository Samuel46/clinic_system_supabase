import prisma_next from "@lib/db";
import { CreatePatientInput } from "@schemas/patients.schemas";

export const createPatient = async (data: CreatePatientInput) => {
  return await prisma_next.$transaction(async (tx) => {
    // Create patient
    const patient = await tx.patient.create({
      data,
    });
    return patient;
  });
};

export const updatePatient = async (id: string, data: Partial<CreatePatientInput>) => {
  return await prisma_next.$transaction(async (tx) => {
    // Fetch current patient data
    const currentPatient = await tx.patient.findUnique({ where: { id } });

    if (!currentPatient) {
      return null; // Handle error in action
    }

    // Update patient data
    const updatedPatient = await tx.patient.update({
      where: { id },
      data,
    });
    return updatedPatient;
  });
};

export const deletePatient = async (id: string) => {
  return await prisma_next.$transaction(async (tx) => {
    // Delete patient
    const deletedPatient = await tx.patient.delete({
      where: { id },
    });
    return deletedPatient;
  });
};

export const getPatientById = async (id: string) => {
  return await prisma_next.patient.findUnique({
    where: { id },
    include: {
      appointments: true,
      medicalRecords: true,
      billings: true,
    },
  });
};

export const getPatientByEmail = async (email: string, tenantId: string) => {
  return await prisma_next.patient.findUnique({
    where: {
      tenantId_email_unique: {
        tenantId: tenantId,
        email: email,
      },
    },
  });
};
