import { InventoryLocation } from "@prisma/client";
import { z } from "zod";

export const createInventorySchema = z.object({
  medicationId: z.string().min(1, { message: "Medication ID is required" }),
  tenantId: z.string().min(1, { message: "Tenant ID is required" }),
  quantity: z
    .number({
      required_error: "Quantity is required",
      invalid_type_error: "Quantity is required",
    })
    .int()
    .positive({ message: "Quantity must be a non-negative integer greater than 0." }),
  threshold: z
    .number({
      required_error: "Threshold is required",
      invalid_type_error: "Threshold is required",
    })
    .int()
    .positive({ message: "Threshold must be a non-negative integer greater than 0." }),
  expirationDate: z.date().optional(),
  location: z.nativeEnum(InventoryLocation).optional(),
});

export const updateInventorySchema = createInventorySchema.partial();

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
