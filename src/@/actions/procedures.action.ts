"use server";
import { Procedure } from "@prisma/client";
import {
  CreateProcedureEquipmentInput,
  CreateProcedureInput,
  CreateProcedureStepInput,
} from "@schemas/procedure.schemas";
import {
  createProcedure,
  deleteEquipmentById,
  deleteProcedure,
  deleteStepByProcedureId,
  updateProcedure,
  upsertEquipmentForProcedure,
  upsertStepsForProcedure,
} from "@services/procedures.service";

export const createProcedureAction = async (data: CreateProcedureInput) => {
  try {
    const procedure = await createProcedure(data);
    return {
      success: true,
      data: procedure,
      msg: "Procedure created successfully",
    };
  } catch (error: any) {
    console.error("Failed to create procedure:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create procedure",
    };
  }
};

export const updateProcedureAction = async (data: CreateProcedureInput, id: string) => {
  try {
    const procedure = await updateProcedure(id, data);
    return {
      success: true,
      data: procedure,
      msg: "Procedure updated successfully",
    };
  } catch (error: any) {
    console.error("Failed to updated procedure:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to updated procedure",
    };
  }
};

export const addStepsToProcedureAction = async (
  procedureId: string,
  steps: CreateProcedureStepInput[]
): Promise<{ success: boolean; msg: string }> => {
  try {
    await upsertStepsForProcedure(procedureId, steps);
    return {
      success: true,

      msg: "Procedure steps added/updated successfully",
    };
  } catch (error: any) {
    console.error("Failed to add/update procedure steps:", error);
    return {
      success: false,
      msg: error.message || "Failed to add/update procedure steps",
    };
  }
};

export const addEquipmentToProcedureAction = async (
  procedureId: string,
  equipment: CreateProcedureEquipmentInput[]
) => {
  try {
    await upsertEquipmentForProcedure(procedureId, equipment);
    return {
      success: true,
      msg: "Procedure equipment added/updated successfully",
    };
  } catch (error: any) {
    console.error("Failed to add/update procedure equipment:", error);
    return {
      success: false,
      msg: error.message || "Failed to add/update procedure equipment",
    };
  }
};

export const deleteProcedureAction = async (procedureId: string) => {
  try {
    const procedure = await deleteProcedure(procedureId);

    return {
      success: true,
      data: procedure,
      msg: "Procedure and related data deleted successfully",
    };
  } catch (error: any) {
    console.error("Failed to delete procedure:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete procedure",
    };
  }
};

export const deleteStepAction = async (stepId: string) => {
  try {
    const deletedStep = await deleteStepByProcedureId(stepId);

    return {
      success: true,
      data: deletedStep,
      msg: "Step deleted successfully",
    };
  } catch (error: any) {
    console.error("Failed to delete step:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete step",
    };
  }
};

export const deleteEquipmentAction = async (equipmentId: string) => {
  try {
    const deletedEquipment = await deleteEquipmentById(equipmentId);

    return {
      success: true,
      data: deletedEquipment,
      msg: "Equipment deleted successfully",
    };
  } catch (error: any) {
    console.error("Failed to delete equipment:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete equipment",
    };
  }
};
