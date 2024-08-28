"use server";
import { Billing } from "@prisma/client";
import { CreateBillingInput } from "@schemas/bills.schemas";
import { createBilling, deleteBilling, updateBilling } from "@services/bills.service";
import { revalidatePath } from "next/cache";

export async function createBillingAction(
  data: CreateBillingInput
): Promise<{ success: boolean; data: Billing | null; msg: string }> {
  try {
    const billing = await createBilling(data);
    revalidatePath("/admin/bills");
    return { success: true, data: billing, msg: "Billing record created successfully" };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create billing record",
    };
  }
}

export async function updateBillingAction(
  id: string,
  data: CreateBillingInput
): Promise<{ success: boolean; data: Billing | null; msg: string }> {
  try {
    const billing = await updateBilling(id, data);
    revalidatePath("/admin/bills");
    return { success: true, data: billing, msg: "Billing record updated successfully" };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update billing record",
    };
  }
}

export async function deleteBillingAction(
  id: string
): Promise<{ success: boolean; data: null; msg: string }> {
  try {
    await deleteBilling(id);
    return { success: true, data: null, msg: "Billing record deleted successfully" };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to delete billing record",
    };
  }
}
