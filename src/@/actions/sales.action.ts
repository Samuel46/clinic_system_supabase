"use server";

import { PaymentStatus, Sale } from "@prisma/client";
import { CreateSaleInput, UpdateSaleInput } from "@schemas/sales.schemas";
import {
  AggregatedItem,
  InventoryUpdateResult,
  updateInventoryLevels,
  validateInventory,
} from "@services/inventory.service";
import {
  changePaymentStatus,
  createSale,
  deleteSale,
  getSaleById,
  updateSale,
} from "@services/sales.service";
import { redirect } from "next/navigation";

export async function createSaleAction(
  data: CreateSaleInput
): Promise<{ success: boolean; sale?: Sale; msg?: string; warnings?: string }> {
  // Aggregate items by medicationId for validating and updating inventory
  const aggregatedItems = data.items.reduce((acc, item) => {
    const existingItem = acc.find((i) => i.medicationId === item.medicationId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, [] as AggregatedItem[]);

  // Validate inventory
  const validationResult: InventoryUpdateResult = await validateInventory(
    aggregatedItems,
    data.tenantId
  );

  if (!validationResult.success) {
    return { success: false, msg: validationResult.msg };
  }

  // Create sale
  const saleResult = await createSale(data);

  if (!saleResult.success) {
    return { success: false, msg: saleResult.msg };
  }

  return {
    success: true,
    sale: saleResult.sale,
    msg: saleResult.msg,
    warnings: validationResult.warnings,
  };
}

export async function changePaymentStatusAction(
  saleId: string,
  newStatus: PaymentStatus
): Promise<{ success: boolean; sale?: Sale; msg?: string }> {
  if (!saleId || !newStatus) {
    return { success: false, msg: "Sale ID and new status are required" };
  }

  try {
    const sale = await changePaymentStatus(saleId, newStatus);
    return {
      success: true,
      sale,
      msg: `Payment status updated to ${newStatus} for sale ${saleId}`,
    };
  } catch (error: any) {
    return { success: false, msg: `Failed to change payment status: ${error.message}` };
  }
}

export const updateSaleAction = async (
  id: string,
  data: UpdateSaleInput
): Promise<{ success: boolean; sale?: Sale | null; msg: string; warnings?: string }> => {
  try {
    const updatedSale = await updateSale(id, data);

    if (!updatedSale) {
      return { success: false, sale: null, msg: "Sale not found" };
    }

    return {
      success: true,
      sale: updatedSale,
      msg: "Sale updated successfully",
    };
  } catch (error: any) {
    console.error("Failed to update sale:", error);
    return {
      success: false,
      sale: null,
      msg: error.message || "Failed to update sale",
    };
  }
};

export const deleteSaleAction = async (
  id: string
): Promise<{ success: boolean; data: any; msg: string }> => {
  try {
    const deletedSale = await deleteSale(id);
    return {
      success: true,
      data: deletedSale,
      msg: "Sale deleted successfully",
    };
  } catch (error: any) {
    console.error("Failed to delete sale:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete sale",
    };
  }
};

export const getSaleAction = async (
  id: string
): Promise<{ success: boolean; data: any; msg: string }> => {
  try {
    const sale = await getSaleById(id);
    if (!sale) {
      return { success: false, data: null, msg: "Sale not found" };
    }

    return {
      success: true,
      data: sale,
      msg: "Sale retrieved successfully",
    };
  } catch (error: any) {
    console.error("Failed to get sale:", error);
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to get sale",
    };
  }
};
