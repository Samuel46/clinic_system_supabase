import { number, z } from "zod";
import { PaymentStatus, PaymentMethod } from "@prisma/client";

export const saleItemSchema = z.object({
  medicationId: z.string().min(1, { message: "Medication ID is required" }),
  quantity: z.number().min(1, { message: "Quantity must be at least 1" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
});

export const createSaleSchema = z.object({
  tenantId: z.string().min(1, { message: "Tenant ID is required" }),
  userId: z.string().min(1, { message: "User ID is required" }),
  customerId: z.string().optional(),
  totalAmount: z.number().min(0, { message: "Total amount must be a positive number" }),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentStatus: z.nativeEnum(PaymentStatus).default(PaymentStatus.PENDING),
  items: z
    .array(saleItemSchema)
    .min(1, { message: "At least one sale item is required" }),
  change: z.number().optional(),
  cashReceived: z
    .number()
    .positive({ message: "Cash received must be a positive number greater than zero." }),
});

export const updateSaleSchema = createSaleSchema.partial();

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
export type UpdateSaleInput = z.infer<typeof updateSaleSchema>;
