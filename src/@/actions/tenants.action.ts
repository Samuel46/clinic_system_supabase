"use server";

import { Tenant } from "@prisma/client";
import { createTenantSchema } from "@schemas/tenant.schemas";
import {
  checkEmailExists,
  createTenant,
  deleteTenant,
  updateTenant,
} from "@services/tenants.service";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createTenantAction(
  formData: FormData
): Promise<{ success: boolean; data: Tenant | {}; msg: string }> {
  try {
    const data = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
    };

    // Validate data on the server side to ensure integrity
    const validatedData = createTenantSchema.parse(data);

    // Check if the email already exists
    const emailExists = await checkEmailExists(validatedData.contactEmail);
    if (emailExists) {
      return { success: false, data: {}, msg: "Email already exists" };
    }

    // Create tenant using the service
    const tenant = await createTenant(validatedData);
    revalidatePath("/");

    return { success: true, data: tenant, msg: "Tenant created successfully" };
  } catch (error) {
    console.log(error, "error");
    return { success: false, data: {}, msg: "Error creating tenant" };
  }
}

export async function deleteTenantAction(
  id: string
): Promise<{ success: boolean; data: Tenant | null; msg: string }> {
  try {
    await deleteTenant(id);
    return { success: true, data: null, msg: "Tenant deleted successfully" };
  } catch (error) {
    return { success: false, data: null, msg: "Internal server error" };
  }
}

export async function updateTenantAction(
  formData: FormData,
  id: string
): Promise<{ success: boolean; data: Tenant | null; msg: string }> {
  try {
    const data = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      contactEmail: formData.get("contactEmail") as string,
      contactPhone: formData.get("contactPhone") as string,
    };

    // Validate data on the server side to ensure integrity
    const validatedData = createTenantSchema.parse(data);

    // update tenant using the service
    const tenant = await updateTenant(validatedData, id);
    revalidatePath("/");

    return { success: true, data: tenant, msg: "Tenant updated successfully" };
  } catch (error) {
    console.log(error, "error");
    if (error instanceof z.ZodError) {
      return { success: false, data: null, msg: "Validation error" };
    }
    return { success: false, data: null, msg: "Internal server error" };
  }
}
