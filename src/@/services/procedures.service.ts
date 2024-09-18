import prisma_next from "@lib/db";
import {
  CreateProcedureEquipmentInput,
  CreateProcedureInput,
  CreateProcedureStepInput,
} from "@schemas/procedure.schemas";
import { Procedure } from "@prisma/client";

export const createProcedure = async (data: CreateProcedureInput): Promise<Procedure> => {
  return await prisma_next.procedure.create({ data });
};

export const updateProcedure = async (
  id: string,
  data: CreateProcedureInput
): Promise<Procedure> => {
  return await prisma_next.procedure.update({
    where: { id },
    data,
  });
};

export const deleteProcedure = async (id: string): Promise<Procedure> => {
  return await prisma_next.procedure.delete({
    where: { id },
  });
};

export const getProcedureById = async (id: string): Promise<Procedure | null> => {
  return await prisma_next.procedure.findUnique({
    where: { id },
  });
};

export const getAllProceduresByTenantId = async (
  tenantId: string
): Promise<Procedure[]> => {
  return await prisma_next.procedure.findMany({
    where: { tenantId },
  });
};

export const upsertStepsForProcedure = async (
  procedureId: string,
  steps: CreateProcedureStepInput[]
): Promise<void> => {
  // Start a transaction for atomic operations
  await prisma_next.$transaction(async (prisma) => {
    // Fetch existing steps in one query
    const existingSteps = await prisma.procedureStep.findMany({
      where: { procedureId },
    });

    // Map of stepNumber to existing steps for fast lookup
    const existingStepsMap = new Map(
      existingSteps.map((step) => [step.stepNumber, step])
    );

    const stepsToCreate = [];
    const stepsToUpdate = [];

    for (const step of steps) {
      const existingStep = existingStepsMap.get(step.stepNumber);
      if (!existingStep) {
        // New step to create
        stepsToCreate.push({
          procedureId,
          stepNumber: step.stepNumber,
          description: step.description,
          duration: step.duration,
          role: step.role,
        });
      } else if (
        existingStep.description !== step.description ||
        existingStep.duration !== step.duration ||
        existingStep.role !== step.role
      ) {
        // If any field differs, prepare for update
        stepsToUpdate.push({
          stepNumber: step.stepNumber,
          description: step.description,
          duration: step.duration,
          role: step.role,
        });
      }
    }

    // Bulk create new steps
    if (stepsToCreate.length > 0) {
      await prisma.procedureStep.createMany({
        data: stepsToCreate,
        skipDuplicates: true, // Ensures no duplicate creation
      });
    }

    // Bulk update modified steps
    if (stepsToUpdate.length > 0) {
      await Promise.all(
        stepsToUpdate.map((step) =>
          prisma.procedureStep.update({
            where: {
              procedureId_stepNumber: {
                procedureId,
                stepNumber: step.stepNumber,
              },
            },
            data: {
              description: step.description,
              duration: step.duration,
              role: step.role,
            },
          })
        )
      );
    }
  });
};

export const upsertEquipmentForProcedure = async (
  procedureId: string,
  equipment: CreateProcedureEquipmentInput[]
): Promise<void> => {
  await prisma_next.$transaction(async (prisma) => {
    // Fetch existing equipment in one query
    const existingEquipment = await prisma.procedureEquipment.findMany({
      where: { procedureId },
    });

    // Map for fast lookup
    const existingEquipmentMap = new Map(
      existingEquipment.map((item) => [item.equipmentId, item])
    );

    const equipmentToCreate = [];
    const equipmentToUpdate = [];

    for (const item of equipment) {
      const existingItem = existingEquipmentMap.get(item.equipmentId);
      if (!existingItem) {
        // New equipment to create
        equipmentToCreate.push({
          procedureId,
          equipmentId: item.equipmentId,
          quantity: item.quantity,
        });
      } else if (
        existingItem.quantity !== item.quantity ||
        existingItem.equipmentId !== item.equipmentId
      ) {
        // Only update if the quantity differs
        equipmentToUpdate.push({
          equipmentId: item.equipmentId,
          quantity: item.quantity,
        });
      }
    }

    // Bulk create new equipment
    if (equipmentToCreate.length > 0) {
      await prisma.procedureEquipment.createMany({
        data: equipmentToCreate,
        skipDuplicates: true,
      });
    }

    // Bulk update modified equipment
    if (equipmentToUpdate.length > 0) {
      await Promise.all(
        equipmentToUpdate.map((item) =>
          prisma.procedureEquipment.update({
            where: {
              procedureId_equipmentId: {
                procedureId,
                equipmentId: item.equipmentId,
              },
            },
            data: {
              quantity: item.quantity,
            },
          })
        )
      );
    }
  });
};

export const deleteStepByProcedureId = async (id: string) => {
  return await prisma_next.procedureStep.deleteMany({
    where: { id },
  });
};

export const deleteEquipmentById = async (id: string) => {
  return await prisma_next.procedureEquipment.deleteMany({
    where: { id },
  });
};
