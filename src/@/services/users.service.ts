import prisma_next from "@lib/db";
import { Invitation } from "@prisma/client";
import { CreateUserInput, UpdateUserInput } from "@schemas/auth.schemas";
import bcrypt from "bcrypt";
import { addHours } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export async function assignRoleToUser(userId: string, roleId: string) {
  const updatedUser = await prisma_next.user.update({
    where: { id: userId },
    data: { roleId },
  });
  return updatedUser;
}

export const registerUser = async (
  data: CreateUserInput,
  token: string,
  invitation: Invitation
) => {
  return await prisma_next.$transaction(async (tx) => {
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create the new user
    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        hashedPassword,
        tenantId: invitation.tenantId,
        roleId: invitation.roleId,
        scheduleId: invitation.scheduleId,
      },
    });

    // Mark the invitation as expired and remove the token
    await tx.invitation.update({
      where: { token: token },
      data: {
        status: "ACCEPTED",
        expiresAt: new Date(), // Set expiresAt to current date to mark as expired
      },
    });

    return user;
  });
};

export async function generateResetToken(
  email: string
): Promise<{ success: boolean; resetToken?: string; resetTokenExpiry?: Date }> {
  const user = await prisma_next.user.findUnique({ where: { email } });
  if (!user) {
    return { success: false };
  }

  const resetToken = uuidv4();
  const resetTokenExpiry = addHours(new Date(), 1); // Token expires in 1 hour

  await prisma_next.user.update({
    where: { email },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  return { success: true, resetToken, resetTokenExpiry };
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<boolean> {
  return await prisma_next.$transaction(async (tx) => {
    const user = await tx.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gte: new Date() } },
    });

    if (!user) {
      return false;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await tx.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return true;
  });
}

export const updateUser = async (id: string, data: UpdateUserInput) => {
  return await prisma_next.$transaction(async (tx) => {
    const currentUser = await tx.user.findUnique({
      where: { id },
    });

    if (!currentUser) {
      return null;
    }

    const hasChanges =
      data.name !== currentUser.name ||
      data.email !== currentUser.email ||
      data.roleId !== currentUser.roleId ||
      data.tenantId !== currentUser.tenantId;

    if (!hasChanges) {
      return currentUser;
    }

    const updatedUser = await tx.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        roleId: data.roleId,
        tenantId: data.tenantId,
      },
    });

    return updatedUser;
  });
};

export const getUserByEmail = async (email: string) => {
  const user = await prisma_next.user.findUnique({
    where: { email: email },
  });

  return user;
};

export const deleteUser = async (id: string) => {
  return await prisma_next.$transaction(async (tx) => {
    // Fetch the current user data
    const currentUser = await tx.user.findUnique({
      where: { id },
    });

    if (!currentUser) {
      return null;
    }

    // Delete the user data
    await tx.user.delete({
      where: { id },
    });

    return { success: true };
  });
};
