"use server";
import { PermissionAction, Role } from "@prisma/client";
import { CreateRoleInput } from "@schemas/role.schemas";
import {
  createRoleWithPermissions,
  deleteRole,
  updateRole,
} from "@services/roles.service";
import { CreateRoleResponse } from "@type/index";
import { revalidatePath } from "next/cache";

export async function createRoleAction(
  name: string,
  description: string,
  permissionActions: PermissionAction[]
): Promise<CreateRoleResponse> {
  try {
    const { role, permissions } = await createRoleWithPermissions(
      name,
      description,
      permissionActions
    );
    revalidatePath("/admin/roles");
    return {
      success: true,
      data: { role, permissions },
      msg: "Role and permissions created successfully",
    };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create role and assign permissions",
    };
  }
}

export const updateRoleAction = async (
  data: CreateRoleInput,
  roleId: string
): Promise<{ success: boolean; data: any; msg: string }> => {
  try {
    const result = await updateRole(data, roleId);
    revalidatePath("/admin/roles");
    return {
      success: true,
      data: result,
      msg: "Role updated successfully",
    };
  } catch (error: any) {
    console.error("Failed to update role:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update role",
    };
  }
};
export async function deleteRoleAction(
  roleId: string
): Promise<{ success: boolean; data: null; msg: string }> {
  try {
    await deleteRole(roleId);
    return {
      success: true,
      data: null,
      msg: "Role deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
      msg: "Failed to delete role",
    };
  }
}
