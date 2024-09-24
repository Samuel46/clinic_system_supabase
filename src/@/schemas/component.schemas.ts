import { z } from "zod";

export const componentSchema = z.object({
  name: z.string().min(1, "Component name is required."),
  tenantId: z.string(),
  userId: z.string(),
  description: z.string().optional(),
  unitCost: z.number().min(0, "Unit cost must be a positive number."),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createComponentSchema = componentSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const updateComponentSchema = componentSchema.partial();

export type CreateComponentInput = z.infer<typeof createComponentSchema>;
export type UpdateComponentInput = z.infer<typeof updateComponentSchema>;
