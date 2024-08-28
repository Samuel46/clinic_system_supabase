// schemas.ts
import { z } from "zod";

// Define the Zod schema for creating a tenant
export const createTenantSchema = z.object({
  name: z.string().min(1, { message: "Tenant name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  contactEmail: z.string().email({ message: "Invalid email address" }),
  contactPhone: z
    .string()
    .min(10, { message: "Contact phone must be at least 10 digits long" }),
});

// Infer the types from the Zod schema
export type CreateTenantInput = z.infer<typeof createTenantSchema>;
