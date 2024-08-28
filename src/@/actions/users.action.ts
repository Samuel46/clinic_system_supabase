"use server";
import { Invitation, User } from "@prisma/client";
import { CreateUserInput, UpdateUserInput } from "@schemas/auth.schemas";
import { sendResetEmail } from "@services/emails.service";
import {
  getInvitationByToken,
  updateInvitationStatus,
} from "@services/invitation.service";
import {
  assignRoleToUser,
  deleteUser,
  generateResetToken,
  getUserByEmail,
  registerUser,
  resetPassword,
  updateUser,
} from "@services/users.service";

import { revalidatePath } from "next/cache";

export async function registerUserAction(
  data: CreateUserInput,
  token: string
): Promise<{ success: boolean; data: User | null; msg: string }> {
  try {
    // Validate the invitation token and ensure it matches the email
    const invitation = await getInvitationByToken(token);

    if (!invitation) {
      // update the status to expired
      await updateInvitationStatus(token, "EXPIRED");
      return { success: false, data: null, msg: "Invalid or expired token" };
    }

    if (invitation.email !== data.email) {
      // update the status to declined
      await updateInvitationStatus(token, "DECLINED");
      return { success: false, data: null, msg: "Email does not match invitation" };
    }

    // Find user by email
    const existingUser = await getUserByEmail(data.email);

    if (existingUser) {
      return { success: false, data: null, msg: "User already exists!" };
    }

    const user = await registerUser(data, token, invitation);
    return { success: true, data: user, msg: "User registered successfully" };
  } catch (error: any) {
    console.error("Failed to register user:", error);
    return {
      success: false,
      data: null,
      msg: "Failed to register user",
    };
  }
}

export async function updateUserAction(
  id: string,
  data: UpdateUserInput
): Promise<{ success: boolean; data: User | null; msg: string }> {
  try {
    const updatedUser = await updateUser(id, data);
    if (!updatedUser) {
      return { success: false, data: null, msg: "User not found or no changes detected" };
    }
    revalidatePath("/admin/users/");
    return { success: true, data: updatedUser, msg: "User updated successfully" };
  } catch (error: any) {
    console.error("Failed to update user:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update user",
    };
  }
}

export async function forgotPasswordAction(
  email: string
): Promise<{ success: boolean; msg: string }> {
  try {
    const result = await generateResetToken(email);

    if (!result) {
      return {
        success: false,

        msg: "No account found with that email address.",
      };
    }

    const emailSent = await sendResetEmail(email, result.resetToken);

    if (!emailSent) {
      return {
        success: false,

        msg: "There was an issue sending the reset email. Please try again later.",
      };
    }

    return {
      success: true,

      msg: "A password reset link has been sent to your email address. Please check your inbox.",
    };
  } catch (error) {
    return {
      success: false,

      msg: "An unexpected error occurred while processing your request. Please try again later.",
    };
  }
}

export async function resetPasswordAction(
  token: string,
  newPassword: string
): Promise<{ success: boolean; msg: string }> {
  try {
    const success = await resetPassword(token, newPassword);

    if (!success) {
      return { success: false, msg: "Invalid or expired token." };
    }

    return { success: true, msg: "Your password has been successfully reset." };
  } catch (error) {
    return {
      success: false,
      msg: "An unexpected error occurred while resetting your password. Please try again later.",
    };
  }
}

export async function assignRoleToUserAction(
  userId: string,
  roleId: string
): Promise<{ success: boolean; data: User | null; msg: string }> {
  try {
    const updatedUser = await assignRoleToUser(userId, roleId);
    return {
      success: true,
      data: updatedUser,
      msg: "Role assigned t do user successfully",
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to assign role to user",
    };
  }
}

export async function deleteUserAction(
  id: string
): Promise<{ success: boolean; msg: string }> {
  try {
    const result = await deleteUser(id);
    if (!result) {
      return { success: false, msg: "User not found" };
    }
    return { success: true, msg: "User deleted successfully" };
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return {
      success: false,
      msg: "Failed to delete user",
    };
  }
}
