import prisma_next from "@lib/db";
import { Treatment } from "@prisma/client";
import {
  CreateTreatmentComponentInput,
  CreateTreatmentInput,
  UpdateTreatmentInput,
} from "@schemas/treament.schemas";

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

export const getTreatmentByName = async (name: string): Promise<Treatment | null> => {
  return prisma_next.treatment.findUnique({
    where: { name },
  });
};

export const getAllTreatments = async (): Promise<Treatment[]> => {
  return prisma_next.treatment.findMany();
};

export const upsertEquipmentForTreatment = async (
  treatmentId: string,
  equipment: CreateTreatmentComponentInput[]
): Promise<void> => {
  await prisma_next.$transaction(async (prisma) => {
    // Fetch existing equipment in one query
    const existingEquipment = await prisma.treatmentComponent.findMany({
      where: { treatmentId },
    });

    // Map for fast lookup
    const existingEquipmentMap = new Map(
      existingEquipment.map((item) => [item.componentId, item])
    );

    const equipmentToCreate = [];
    const equipmentToUpdate = [];

    for (const item of equipment) {
      const existingItem = existingEquipmentMap.get(item.componentId);
      if (!existingItem) {
        // New equipment to create
        equipmentToCreate.push({
          treatmentId,
          componentId: item.componentId,
          quantity: item.quantity,
        });
      } else if (
        existingItem.quantity !== item.quantity ||
        existingItem.componentId !== item.componentId
      ) {
        // Only update if the quantity differs
        equipmentToUpdate.push({
          componentId: item.componentId,
          quantity: item.quantity,
        });
      }
    }

    // Bulk create new equipment
    if (equipmentToCreate.length > 0) {
      await prisma.treatmentComponent.createMany({
        data: equipmentToCreate,
        skipDuplicates: true,
      });
    }

    // Bulk update modified equipment
    if (equipmentToUpdate.length > 0) {
      await Promise.all(
        equipmentToUpdate.map((item) =>
          prisma.treatmentComponent.update({
            where: {
              treatmentId_componentId: {
                treatmentId,
                componentId: item.componentId,
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

export const deleteEquipmentById = async (id: string) => {
  return await prisma_next.treatmentComponent.delete({
    where: { id },
  });
};
