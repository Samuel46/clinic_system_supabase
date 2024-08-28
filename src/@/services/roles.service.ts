import prisma_next from "@lib/db";
import { PermissionAction, Role, RolePermission } from "@prisma/client";
import { CreateRoleInput } from "@schemas/role.schemas";

export const createRoleWithPermissions = async (
  name: string,
  description: string,
  permissionActions: PermissionAction[]
) => {
  return await prisma_next.$transaction(async (tx) => {
    const existingRole = await tx.role.findUnique({
      where: { name },
    });

    if (existingRole) {
      throw new Error(`Role with name "${name}" already exists.`);
    }

    // Remove duplicate permissions
    const uniquePermissionActions = Array.from(new Set(permissionActions));

    // Fetch permissions based on the unique actions
    const permissions = await tx.permission.findMany({
      where: {
        action: { in: uniquePermissionActions },
      },
    });

    // Create the role
    const role = await tx.role.create({
      data: {
        name,
        description,
        permissions: {
          create: permissions.map((permission) => ({
            permissionId: permission.id,
          })),
        },
      },
    });

    return { role, permissions };
  });
};

export const updateRole = async (data: CreateRoleInput, roleId: string) => {
  return await prisma_next.$transaction(async (tx) => {
    // Fetch current role data
    const currentRole = await tx.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!currentRole) {
      throw new Error("Role not found");
    }

    // Compare current data with submitted data
    const basicInfoChanged =
      data.name !== currentRole.name || data.description !== currentRole.description;
    const permissionsChanged =
      data.permissions.sort().join() !==
      currentRole.permissions
        .map((p) => p.permission.action)
        .sort()
        .join();

    // Update the role's basic information if there are changes
    if (basicInfoChanged) {
      await tx.role.update({
        where: { id: roleId },
        data: {
          name: data.name,
          description: data.description,
        },
      });
    }

    if (permissionsChanged) {
      // Fetch permissions based on the unique actions
      const permissions = await tx.permission.findMany({
        where: {
          action: { in: data.permissions },
        },
      });

      const currentPermissionIds = new Set(
        currentRole.permissions.map((p) => p.permissionId)
      );
      const newPermissionIds = new Set(permissions.map((p) => p.id));

      const permissionsToAdd = permissions.filter((p) => !currentPermissionIds.has(p.id));
      const permissionsToRemove = currentRole.permissions.filter(
        (rp) => !newPermissionIds.has(rp.permissionId)
      );

      // Add new permissions
      if (permissionsToAdd.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionsToAdd.map(({ id: permissionId }) => ({
            roleId,
            permissionId,
          })),
        });
      }

      // Remove old permissions
      if (permissionsToRemove.length > 0) {
        await tx.rolePermission.deleteMany({
          where: {
            roleId,
            permissionId: { in: permissionsToRemove.map((rp) => rp.permissionId) },
          },
        });
      }
    }

    // Fetch the updated role with permissions
    const roleWithPermissions = await tx.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return roleWithPermissions;
  });
};
export const deleteRole = async (roleId: string) => {
  return await prisma_next.$transaction(async (tx) => {
    // Delete associated RolePermission entries
    await tx.rolePermission.deleteMany({
      where: {
        roleId,
      },
    });

    // Delete the role
    const role = await tx.role.delete({
      where: {
        id: roleId,
      },
    });

    return role;
  });
};
