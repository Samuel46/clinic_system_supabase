import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  tenantId: z.string().min(1, { message: "Tenant ID is required" }),
  roleId: z.string().min(1, { message: "Role ID is required" }),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
