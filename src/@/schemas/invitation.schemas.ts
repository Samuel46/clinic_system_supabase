import { z } from "zod";
import { createScheduleSchema } from "./schedule.schemas";

export const createInvitationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  tenantId: z.string().min(1, { message: "Tenant ID is required" }),
  roleId: z.string().min(1, { message: "Role ID is required" }),
  // schedule: createScheduleSchema.optional(),
  // scheduleId: z.string().optional(),
});

export const updateInvitationSchema = createInvitationSchema.optional();

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>;
