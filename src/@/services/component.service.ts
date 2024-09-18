import prisma_next from "@lib/db";
import { CreateComponentInput, UpdateComponentInput } from "@schemas/component.schemas";

export const createComponent = async (data: CreateComponentInput) => {
  return await prisma_next.component.create({
    data,
  });
};

export const getAllComponents = async () => {
  return await prisma_next.component.findMany();
};

export const getComponentById = async (id: string) => {
  return await prisma_next.component.findUnique({
    where: { id },
  });
};

export const getComponentByName = async (name: string) => {
  return await prisma_next.component.findUnique({
    where: { name },
  });
};

export const updateComponent = async (id: string, data: UpdateComponentInput) => {
  return await prisma_next.component.update({
    where: { id },
    data,
  });
};

export const deleteComponent = async (id: string) => {
  return await prisma_next.component.delete({
    where: { id },
  });
};
