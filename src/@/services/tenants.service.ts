"use server";
import prisma_next from "@lib/db";
import { CreateTenantInput } from "@schemas/tenant.schemas";

export async function createTenant(data: CreateTenantInput) {
  const tenant = await prisma_next.tenant.create({
    data,
  });

  return tenant;
}

export async function checkEmailExists(email: string) {
  const existingTenant = await prisma_next.tenant.findUnique({
    where: { contactEmail: email },
  });

  return !!existingTenant;
}

export const deleteTenant = async (id: string) => {
  return await prisma_next.tenant.delete({
    where: { id },
  });
};

export const updateTenant = async (data: CreateTenantInput, id: string) => {
  return await prisma_next.tenant.update({
    where: { id },
    data: data,
  });
};
