"use server";
import { Invitation, Prisma } from "@prisma/client";
import { CreateInvitationInput } from "@schemas/invitation.schemas";
import { sendInvitationEmail } from "@services/emails.service";
import {
  checkInvitationExists,
  createInvitation,
  deleteInvitation,
  updateInvitation,
} from "@services/invitation.service";
import { InvitationWithRoleAndTenant } from "@type/index";
import { revalidatePath } from "next/cache";

export async function createInvitationAction(
  data: CreateInvitationInput
): Promise<{ success: boolean; data: Invitation | null; msg: string }> {
  try {
    // Check if invitation already exists
    const existingInvitation = await checkInvitationExists(data.email);
    if (existingInvitation) {
      return {
        success: false,
        data: null,
        msg: `Invitation for email "${data.email}" already exists.`,
      };
    }

    // Create the invitation
    const { invitation } = await createInvitation(data);

    // Send the invitation email
    // await sendInvitationEmail(
    //   invitation.email,
    //   invitation.token,
    //   invitation?.tenant.name
    // );
    revalidatePath("/admin/invitations");

    return {
      success: true,
      data: invitation,
      msg: "Invitation created and email sent successfully",
    };
  } catch (error: any) {
    console.error("Failed to create invitation:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create invitation",
    };
  }
}

export const sendInvitationEmailAction = async (
  invitation: Prisma.InvitationGetPayload<{
    include: {
      tenant: true;
    };
  }>
): Promise<{ success: boolean; msg: string }> => {
  try {
    if (!invitation.email || !invitation.token || !invitation.tenant.name) {
      throw new Error("Invalid invitation data. Missing required fields.");
    }

    await sendInvitationEmail(invitation.email, invitation.token, invitation.tenant.name);

    return { success: true, msg: "Invitation email sent successfully" };
  } catch (error: any) {
    console.error("Failed to send invitation email:", error);
    return { success: false, msg: error.message || "Failed to send invitation email" };
  }
};

export const updateInvitationAction = async (
  id: string,
  data: CreateInvitationInput
): Promise<{ success: boolean; data: Invitation | null; msg: string }> => {
  try {
    const updatedInvitation = await updateInvitation(id, data);
    return {
      success: true,
      data: updatedInvitation,
      msg: "Invitation updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      msg: "Failed to update invitation",
    };
  }
};

export const deleteInvitationAction = async (
  id: string
): Promise<{ success: boolean; data: Invitation | null; msg: string }> => {
  try {
    const deletedInvitation = await deleteInvitation(id);
    return {
      success: true,
      data: deletedInvitation,
      msg: "Invitation deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      msg: "Failed to delete invitation",
    };
  }
};
