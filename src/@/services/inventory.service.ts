import prisma_next from "@lib/db";
import { CreateInventoryInput, UpdateInventoryInput } from "@schemas/inventory.schemas";
import {
  eachMonthOfInterval,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

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
  let warningMessages: string[] = [];
  let successMessages: string[] = [];

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

    if (inventory.quantity < item.quantity) {
      return {
        success: false,
        msg: `Not enough inventory for medication ${inventory.medication.name}. Please update your stock. Current stock ${inventory.quantity}`,
      };
    }

    let message = `Validated inventory for medication ${inventory.medication.name}.`;
    successMessages.push(message);

    if (inventory.quantity < inventory.threshold) {
      const warning = `Warning: Inventory for medication ${
        inventory.medication.name
      } is low. Current stock: ${inventory.quantity - item.quantity}, threshold: ${
        inventory.threshold
      }. Please consider restocking.`;
      warningMessages.push(warning);
    }
  }

  return {
    success: true,
    warnings: warningMessages.length > 0 ? warningMessages.join(" ") : undefined,
    msg: successMessages.join(" "),
  };
}

export async function updateInventoryLevels(
  items: AggregatedItem[],
  tenantId: string
): Promise<any> {
  return await prisma_next.$transaction(async (tx) => {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await tx.inventory.updateMany({
        where: {
          medicationId: item.medicationId,
          tenantId: tenantId,
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }
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
