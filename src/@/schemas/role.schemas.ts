import { z } from "zod";
import { PermissionAction } from "@prisma/client";

const permissionEnumValues = Object.values(PermissionAction);

export const createRoleSchema = z.object({
  description: z.string().min(1, "Description is required."),
  name: z.string().min(1, "Role name is required."),
  permissions: z
    .array(z.enum(permissionEnumValues as [PermissionAction, ...PermissionAction[]]))
    .min(1, "At least one permission is required."),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
