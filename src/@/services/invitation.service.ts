import prisma_next from "@lib/db";
import { InvitationStatus } from "@prisma/client";
import { CreateInvitationInput } from "@schemas/invitation.schemas";
import { v4 as uuidv4 } from "uuid";

export const createInvitation = async (data: CreateInvitationInput) => {
  return await prisma_next.$transaction(async (tx) => {
    const { email, tenantId, roleId } = data;

    // Generate a unique token
    const token = uuidv4();

    // Set expiration time (e.g., 24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // Create a shell schedule
    const shellSchedule = await tx.schedule.create({
      data: {
        workDays: {
          create: [], // Initialize empty, to be filled later
        },
        daysOff: {
          create: [], // Initialize empty, to be filled later
        },
        // Invitation: {
        //   connect: { id: invitation.id }, // Link the schedule to the invitation
        // },
      },
    });

    // Create the invitation
    const invitation = await tx.invitation.create({
      data: {
        email,
        token,
        expiresAt,
        tenantId,
        roleId,
        scheduleId: shellSchedule.id,
      },
      include: {
        tenant: true,
        schedule: true,
      },
    });

    return {
      invitation,
    };
  });
};

export const checkInvitationExists = async (email: string) => {
  const existingInvitation = await prisma_next.invitation.findUnique({
    where: { email },
  });

  return existingInvitation;
};

export const updateInvitation = async (id: string, data: CreateInvitationInput) => {
  const updatedInvitation = await prisma_next.invitation.update({
    where: { id },
    data,
  });
  return updatedInvitation;
};

export const deleteInvitation = async (id: string) => {
  const deletedInvitation = await prisma_next.invitation.delete({
    where: { id },
  });
  return deletedInvitation;
};

export const getInvitationByToken = async (token: string) => {
  const invitation = await prisma_next.invitation.findUnique({
    where: { token },
    include: {
      tenant: true,
      role: true,
    },
  });

  const now = new Date();

  if (invitation?.expiresAt && invitation?.expiresAt < now) {
    return null; // Return null if the invitation is expired
  }

  return invitation;
};

export async function updateInvitationStatus(token: string, status: InvitationStatus) {
  try {
    const updatedInvitation = await prisma_next.invitation.update({
      where: {
        token,
      },
      data: {
        status,
      },
    });

    return updatedInvitation;
  } catch (error) {
    console.error("Error updating invitation status:", error);
  }
}
