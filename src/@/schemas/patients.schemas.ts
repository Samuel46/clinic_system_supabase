import { z } from "zod";

export const createPatientSchema = z.object({
  tenantId: z.string().min(1, { message: "Tenant ID is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits long" }),
  address: z.string().min(1, { message: "Address is required" }),
  dateOfBirth: z
    .date()
    .optional()
    .refine((date) => date !== undefined, {
      message: "Date of Birth is required",
    }),
  medicalHistory: z.string().optional(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
