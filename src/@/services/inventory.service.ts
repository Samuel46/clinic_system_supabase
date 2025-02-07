"use server";
import {
  eachMonthOfInterval,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

import prisma_next from "@lib/db";
import { CreateInventoryInput, UpdateInventoryInput } from "@schemas/inventory.schemas";
import { UpdateInventoryItems } from "@type/index";

export const createInventory = async (data: CreateInventoryInput) => {
  return await prisma_next.inventory.create({
    data,
  });
};

export interface InventoryUpdateResult {
  success: boolean;
  msg?: string;
  warnings?: string;
}
export interface AggregatedItem {
  medicationId: string;
  quantity: number;
}

export async function validateInventory(
  items: { medicationId: string; quantity: number }[],
  tenantId: string
): Promise<InventoryUpdateResult> {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    const inventory = await prisma_next.inventory.findFirst({
      where: {
        medicationId: item.medicationId,
        tenantId: tenantId,
      },
      include: {
        medication: true,
      },
    });

    if (!inventory) {
      return {
        success: false,
        msg: `Inventory not found for medication ID ${item.medicationId}.`,
      };
    }
  }

  return {
    success: true,
  };
}

export async function updateInventoryLevels(
  items: AggregatedItem[],
  tenantId: string
): Promise<UpdateInventoryItems[]> {
  return await prisma_next.$transaction(async (tx) => {
    const results: UpdateInventoryItems[] = [];

    // Use a normal for loop instead of for...of
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Fetch the inventory for the given medication and tenant
      const inventory = await tx.inventory.findFirst({
        where: {
          medicationId: item.medicationId,
          tenantId: tenantId,
        },
        include: {
          medication: true,
        },
      });

      if (!inventory) {
        throw new Error(`Inventory not found for medication ${item.medicationId}`);
      }

      // Deduct the sold quantity from the inventory quantity
      const newQuantity = inventory.quantity - item.quantity;

      // Ensure the quantity never goes negative (can add a safeguard)
      if (newQuantity < 0) {
        return results;
      }

      // Construct the result object for logging
      const result: UpdateInventoryItems = {
        medicationId: item.medicationId,
        medicationName: inventory.medication.name,
        previousQuantity: inventory.quantity,
        newQuantity: newQuantity,
        threshold: inventory.threshold,
        quantityWouldGoNegative: false,
        originalQuantityLessThanSold: false,
        belowThreshold: newQuantity < inventory.threshold,
      };

      // Update the inventory quantity
      await tx.inventory.update({
        where: {
          id: inventory.id,
        },
        data: {
          quantity: newQuantity,
        },
      });

      // Add the result to the results array
      results.push(result);
    }

    // Return the results for logging or further use
    return results;
  });
}
export const getInventoryById = async (id: string) => {
  return await prisma_next.inventory.findUnique({
    where: { id },
    include: {
      medication: true,
      tenant: true,
    },
  });
};

export const getInventoryMedicationId = async (id: string) => {
  return await prisma_next.inventory.findUnique({
    where: { medicationId: id },
    include: {
      medication: true,
      tenant: true,
    },
  });
};

export const updateInventory = async (id: string, data: UpdateInventoryInput) => {
  return await prisma_next.inventory.update({
    where: { id },
    data,
  });
};

export const deleteInventory = async (id: string) => {
  return await prisma_next.inventory.delete({
    where: { id },
  });
};

// Chart
export async function fetchInventoryLevels(): Promise<
  { month: string; medication: string; quantity: number }[]
> {
  const inventories = await prisma_next.inventory.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      medication: true,
    },
  });

  if (inventories.length === 0) {
    return [];
  }

  const firstInventoryDate = startOfMonth(inventories[0].createdAt);
  const currentMonth = startOfMonth(new Date());

  const allMonths = eachMonthOfInterval({
    start: firstInventoryDate,
    end: currentMonth,
  }).map((date) => format(date, "yyyy-MM"));

  const inventoryLevels = inventories.reduce((acc, inventory) => {
    const month = format(inventory.createdAt, "yyyy-MM");
    const medication = inventory.medication.name;
    if (!acc[month]) acc[month] = {};
    if (!acc[month][medication]) acc[month][medication] = 0;
    acc[month][medication] += inventory.quantity;
    return acc;
  }, {} as { [key: string]: { [medication: string]: number } });

  const result = allMonths.flatMap((month) => {
    const monthData = inventoryLevels[month] || {};
    return Object.keys(monthData).map((medication) => ({
      month,
      medication,
      quantity: monthData[medication],
    }));
  });

  return result;
}
