"use server";
import prisma_next from "@lib/db";
import { SaleItem } from "@prisma/client";

import {
  CreateInventoryInput,
  createInventorySchema,
  UpdateInventoryInput,
  updateInventorySchema,
} from "@schemas/inventory.schemas";

import {
  AggregatedItem,
  createInventory,
  deleteInventory,
  getInventoryById,
  getInventoryMedicationId,
  updateInventory,
  updateInventoryLevels,
} from "@services/inventory.service";

export const createInventoryAction = async (data: CreateInventoryInput) => {
  try {
    // Validate the input data
    const validationResult = createInventorySchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        msg: "Invalid data",
        errors: validationResult.error.errors,
      };
    }

    // Find inventory by medication ID

    const existingInventory = await getInventoryMedicationId(data.medicationId);

    if (existingInventory) {
      return {
        success: false,
        data: null,
        msg: "Inventory already exist",
      };
    }

    // Perform the database operation
    const inventory = await createInventory(validationResult.data);
    return {
      success: true,
      data: inventory,
      msg: "Inventory created successfully",
    };
  } catch (error: any) {
    console.error("Failed to create inventory:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create inventory",
    };
  }
};

export async function updateInventoryLevelsAction(
  items: SaleItem[],
  tenantId: string
): Promise<{ success: boolean; msg?: string }> {
  if (!items || !tenantId) {
    return { success: false, msg: "Items and tenant ID are required" };
  }

  const aggregatedItems = items.reduce((acc, item) => {
    const existingItem = acc.find((i) => i.medicationId === item.medicationId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, [] as AggregatedItem[]);

  try {
    await updateInventoryLevels(aggregatedItems, tenantId);
    return { success: true, msg: "Inventory levels updated successfully." };
  } catch (error: any) {
    return { success: false, msg: `Failed to update inventory levels: ${error.message}` };
  }
}

export const updateInventoryAction = async (id: string, data: UpdateInventoryInput) => {
  try {
    // Validate the input data
    const validationResult = updateInventorySchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        msg: "Invalid data",
        errors: validationResult.error.errors,
      };
    }

    // Check for changes
    const currentInventory = await getInventoryById(id);
    if (!currentInventory) {
      return { success: false, msg: "Inventory not found" };
    }

    const hasChanges =
      currentInventory.medicationId !== data.medicationId ||
      currentInventory.tenantId !== data.tenantId ||
      currentInventory.quantity !== data.quantity ||
      currentInventory.threshold !== data.threshold ||
      currentInventory.expirationDate?.getTime() !== data.expirationDate?.getTime() ||
      currentInventory.location !== data.location;

    if (!hasChanges) {
      return { success: false, msg: "No changes detected" };
    }

    // Perform the update operation
    const updatedInventory = await updateInventory(id, validationResult.data);
    return {
      success: true,
      data: updatedInventory,
      msg: "Inventory updated successfully",
    };
  } catch (error: any) {
    console.error("Failed to update inventory:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update inventory",
    };
  }
};

export const deleteInventoryAction = async (id: string) => {
  try {
    const deletedInventory = await deleteInventory(id);
    return {
      success: true,
      data: deletedInventory,
      msg: "Inventory deleted successfully",
    };
  } catch (error: any) {
    console.error("Failed to delete inventory:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete inventory",
    };
  }
};
