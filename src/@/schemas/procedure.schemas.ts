import { z } from "zod";

export const procedureStepSchema = z.object({
  id: z.string().uuid("Invalid step ID format").optional(),
  stepNumber: z.number().int().positive("Step number must be a positive integer"),
  description: z.string().min(1, "Step description is required"),
  duration: z.number().optional(),
  role: z.string().optional(),
});

const procedureEquipmentSchema = z.object({
  id: z.string().uuid("Invalid equipment ID format").optional(),
  equipmentId: z.string().min(1, "Equipment id is required"),
  quantity: z.number().int().nonnegative("Quantity must be a non-negative integer"),
});

// Schema for creating a Procedure
export const procedureSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  steps: z.array(procedureStepSchema).optional(),
  equipment: z.array(procedureEquipmentSchema).optional(),
  tenantId: z.string().uuid("Invalid tenant ID format"),
  userId: z.string().uuid("Invalid user ID format").optional(),
});

// Upsert steps or equipments to the procedure
export const upsertStepsOrEquipmentsSteps = z.object({
  steps: z.array(procedureStepSchema).optional(),
  equipment: z.array(procedureEquipmentSchema).optional(),
});

// Schema for creating a Procedure without specifying steps or equipment
export const createProcedureSchema = procedureSchema.omit({
  steps: true,
  equipment: true,
});

// Schema for updating a Procedure with partial fields
export const updateProcedureSchema = procedureSchema.partial();

// TypeScript types inferred from the schemas
export type ProcedureInput = z.infer<typeof procedureSchema>;
export type UpsertStepsOrEquipmentsInput = z.infer<typeof upsertStepsOrEquipmentsSteps>;
export type CreateProcedureStepInput = z.infer<typeof procedureStepSchema>;
export type CreateProcedureEquipmentInput = z.infer<typeof procedureEquipmentSchema>;
export type CreateProcedureInput = z.infer<typeof createProcedureSchema>;
export type UpdateProcedureInput = z.infer<typeof updateProcedureSchema>;
