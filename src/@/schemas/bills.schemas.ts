import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const billingSchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required."),
  patientId: z.string().min(1, "Patient ID is required."),
  userId: z.string().min(1, "User ID is required."),
  treatmentId: z.string().optional(),
  amount: z.number().min(0, "Amount must be a positive number."),
  status: z.enum(["UNPAID", "PAID", "PENDING"]),
  paymentMethod: z.nativeEnum(PaymentMethod, { message: "Invalid payment method" }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createBillingSchema = billingSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const updateBillingSchema = billingSchema.partial();

export type CreateBillingInput = z.infer<typeof createBillingSchema>;
export type UpdateBillingInput = z.infer<typeof updateBillingSchema>;
