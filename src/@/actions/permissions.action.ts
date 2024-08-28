"use server";

import { Permission } from "@prisma/client";
import { createPermissions } from "@services/permissions.service";

export async function createPermissionsAction(): Promise<{
  success: boolean;
  data: Permission | null;
  msg: string;
}> {
  try {
    const response = await createPermissions();
    return { success: true, data: null, msg: response.msg };
  } catch (error) {
    console.error(error);
    return { success: false, data: null, msg: "Failed to create permissions" };
  }
}
