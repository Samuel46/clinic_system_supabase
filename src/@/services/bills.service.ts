import prisma_next from "@lib/db";
import { CreateBillingInput } from "@schemas/bills.schemas";

export const createBilling = async (data: CreateBillingInput) => {
  return await prisma_next.billing.create({
    data,
  });
};

export const updateBilling = async (id: string, data: CreateBillingInput) => {
  return await prisma_next.billing.update({
    where: { id },
    data,
  });
};

export const deleteBilling = async (id: string) => {
  return await prisma_next.billing.delete({
    where: { id },
  });
};
