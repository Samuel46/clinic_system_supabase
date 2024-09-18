"use server";
import { Component } from "@prisma/client";
import { CreateComponentInput, UpdateComponentInput } from "@schemas/component.schemas";
import {
  createComponent,
  deleteComponent,
  getAllComponents,
  getComponentById,
  getComponentByName,
  updateComponent,
} from "@services/component.service";
import { revalidatePath } from "next/cache";

export async function createComponentAction(
  data: CreateComponentInput
): Promise<{ success: boolean; data: Component | null; msg: string }> {
  try {
    const existingComponent = await getComponentByName(data.name);

    if (existingComponent) {
      return {
        success: false,
        data: null,
        msg: "Supply already exist! Try again.",
      };
    }
    const component = await createComponent(data);

    return { success: true, data: component, msg: "Supply created successfully" };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to create supply",
    };
  }
}

export async function updateComponentAction(
  id: string,
  data: UpdateComponentInput
): Promise<{ success: boolean; data: Component | null; msg: string }> {
  try {
    const component = await updateComponent(id, data);
    return { success: true, data: component, msg: "Supply updated successfully" };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to update component",
    };
  }
}

export async function getComponentByIdAction(
  id: string
): Promise<{ success: boolean; data: Component | null; msg: string }> {
  try {
    const component = await getComponentById(id);
    if (!component) {
      return { success: false, data: null, msg: "Component not found" };
    }
    return { success: true, data: component, msg: "Component fetched successfully" };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to fetch component",
    };
  }
}

export async function getAllComponentsAction(): Promise<{
  success: boolean;
  data: Component[] | null;
  msg: string;
}> {
  try {
    const components = await getAllComponents();
    return { success: true, data: components, msg: "Components fetched successfully" };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      msg: error.message || "Failed to fetch components",
    };
  }
}

export async function deleteComponentAction(
  id: string
): Promise<{ success: boolean; msg: string }> {
  try {
    await deleteComponent(id);

    revalidatePath("/admin/supplies");
    return { success: true, msg: "Component deleted successfully" };
  } catch (error: any) {
    return {
      success: false,
      msg: error.message || "Failed to delete component",
    };
  }
}
