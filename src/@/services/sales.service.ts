import prisma_next from "@lib/db";
import { PaymentStatus, Sale } from "@prisma/client";
import { CreateSaleInput, UpdateSaleInput } from "@schemas/sales.schemas";
import { formatAmountKsh } from "@utils/formatNumber";
import {
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";

export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const createSale = async (
  data: CreateSaleInput
): Promise<{ success: boolean; sale?: Sale; msg?: string }> => {
  try {
    return await prisma_next.$transaction(async (tx) => {
      // Aggregate items by medicationId
      const aggregatedItems = data.items.reduce((acc, item) => {
        const existingItem = acc.find((i) => i.medicationId === item.medicationId);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, [] as { medicationId: string; quantity: number; price: number }[]);

      // Create the sale record along with the aggregated sale items
      const sale = await tx.sale.create({
        data: {
          tenantId: data.tenantId,
          userId: data.userId,
          customerId: data.customerId,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus,
          items: {
            create: aggregatedItems.map((item) => ({
              medicationId: item.medicationId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      return {
        success: true,
        sale,
        msg: "Sale created successfully",
      };
    });
  } catch (error: any) {
    return { success: false, msg: error.message };
  }
};

export async function changePaymentStatus(
  saleId: string,
  newStatus: PaymentStatus
): Promise<any> {
  return await prisma_next.sale.update({
    where: { id: saleId },
    data: { paymentStatus: newStatus },
  });
}

export const getSaleById = async (id: string) => {
  return await prisma_next.sale.findUnique({
    where: { id },
    include: {
      items: true,
      tenant: true,
      user: true,
      customer: true,
      receipt: true,
    },
  });
};

export const getAllSales = async () => {
  return await prisma_next.sale.findMany({
    include: {
      items: true,
      tenant: true,
      user: true,
      customer: true,
      receipt: true,
    },
  });
};

export const updateSale = async (id: string, data: UpdateSaleInput) => {
  const sale = await prisma_next.$transaction(async (tx) => {
    const currentSale = await tx.sale.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!currentSale) {
      return null;
    }

    const hasChanges =
      currentSale.tenantId !== data.tenantId ||
      currentSale.userId !== data.userId ||
      currentSale.customerId !== data.customerId ||
      currentSale.totalAmount !== data.totalAmount ||
      currentSale.paymentMethod !== data.paymentMethod ||
      currentSale.paymentStatus !== data.paymentStatus;
    if (hasChanges) {
      await tx.sale.update({
        where: { id },
        data: {
          tenantId: data.tenantId,
          userId: data.userId,
          customerId: data.customerId,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus,
        },
      });
    }

    if (data.items) {
      const currentItems = currentSale.items;

      for (const item of data.items) {
        const currentItem = currentItems.find(
          (ci) => ci.medicationId === item.medicationId
        );

        if (currentItem) {
          if (
            currentItem.quantity !== item.quantity ||
            currentItem.price !== item.price
          ) {
            await tx.saleItem.update({
              where: { id: currentItem.id },
              data: {
                quantity: item.quantity,
                price: item.price,
              },
            });
          }
        } else {
          await tx.saleItem.create({
            data: {
              saleId: id,
              medicationId: item.medicationId,
              quantity: item.quantity,
              price: item.price,
            },
          });
        }
      }

      const newItemIds = data.items.map((item) => item.medicationId);
      const itemsToRemove = currentItems.filter(
        (ci) => !newItemIds.includes(ci.medicationId)
      );

      for (const item of itemsToRemove) {
        await tx.saleItem.delete({
          where: { id: item.id },
        });
      }
    }

    return tx.sale.findUnique({
      where: { id },
      include: { items: true },
    });
  });

  return sale;
};

export const deleteSale = async (id: string) => {
  const sale = await prisma_next.$transaction(async (tx) => {
    await tx.saleItem.deleteMany({
      where: { saleId: id },
    });

    const deletedSale = await tx.sale.delete({
      where: { id },
    });

    return deletedSale;
  });

  return sale;
};
//  Chart
export async function fetchMonthlySales(): Promise<{ month: string; total: number }[]> {
  const sales = await prisma_next.sale.groupBy({
    by: ["createdAt"],
    _sum: {
      totalAmount: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Aggregate sales by month
  const monthlySales = sales.reduce((acc, sale) => {
    const month = sale.createdAt.toISOString().slice(0, 7); // Format: YYYY-MM
    if (!acc[month]) acc[month] = 0;
    acc[month] += sale._sum.totalAmount || 0;
    return acc;
  }, {} as { [key: string]: number });

  return Object.keys(monthlySales).map((month) => ({
    month,
    total: monthlySales[month],
  }));
}

export async function fetchMedicationDistribution(): Promise<
  { medication: string; totalSales: number }[]
> {
  return await prisma_next.$transaction(async (tx) => {
    // Fetch all sale items with their respective medications
    const sales = await tx.saleItem.findMany({
      select: {
        medicationId: true,
        quantity: true,
        price: true,
      },
    });

    // Fetch all medication names in one query
    const medicationIds = Array.from(new Set(sales.map((sale) => sale.medicationId)));
    const medications = await tx.medication.findMany({
      where: { id: { in: medicationIds } },
      select: { id: true, name: true },
    });

    // Create a lookup map for medications
    const medicationMap = new Map(
      medications.map((medication) => [medication.id, medication.name])
    );

    // Calculate the total sales for each medication
    const medicationSalesMap = new Map<string, number>();
    for (const sale of sales) {
      const medicationName = medicationMap.get(sale.medicationId);
      if (medicationName) {
        const totalSale = sale.price * sale.quantity;
        if (medicationSalesMap.has(medicationName)) {
          medicationSalesMap.set(
            medicationName,
            medicationSalesMap.get(medicationName)! + totalSale
          );
        } else {
          medicationSalesMap.set(medicationName, totalSale);
        }
      }
    }

    // Transform the map into an array
    const medicationSales = Array.from(medicationSalesMap.entries()).map(
      ([medication, totalSales]) => ({
        medication,
        totalSales,
      })
    );

    return medicationSales;
  });
}
export async function fetchMonthlySalesData(): Promise<{
  currentMonthSales: number;
  previousMonthSales: number;
}> {
  return await prisma_next.$transaction(async (tx) => {
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());
    const previousMonthStart = startOfMonth(subMonths(new Date(), 1));
    const previousMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const currentMonthSales = await tx.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        createdAt: {
          gte: currentMonthStart,
          lt: currentMonthEnd,
        },
      },
    });

    const previousMonthSales = await tx.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        createdAt: {
          gte: previousMonthStart,
          lt: currentMonthEnd,
        },
      },
    });

    return {
      currentMonthSales: currentMonthSales._sum.totalAmount || 0,
      previousMonthSales: previousMonthSales._sum.totalAmount || 0,
    };
  });
}

export async function fetchWeeklySalesData(): Promise<{
  currentWeekSales: number;
  previousWeekSales: number;
}> {
  return await prisma_next.$transaction(async (tx) => {
    const currentWeekStart = startOfWeek(new Date());
    const currentWeekEnd = endOfWeek(new Date());
    const previousWeekStart = startOfWeek(subWeeks(new Date(), 1));
    const previousWeekEnd = endOfWeek(subWeeks(new Date(), 1));

    const currentWeekSales = await tx.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        createdAt: {
          gte: currentWeekStart,
          lte: currentWeekEnd,
        },
      },
    });

    const previousWeekSales = await tx.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        createdAt: {
          gte: previousWeekStart,
          lte: previousWeekEnd,
        },
      },
    });

    return {
      currentWeekSales: currentWeekSales._sum.totalAmount || 0,
      previousWeekSales: previousWeekSales._sum.totalAmount || 0,
    };
  });
}

export async function fetchTotalSalesData(): Promise<number> {
  return await prisma_next.$transaction(async (tx) => {
    const totalSales = await tx.sale.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    return totalSales._sum.totalAmount || 0;
  });
}

export async function fetchRecentSales(): Promise<Sale[]> {
  return await prisma_next.sale.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10, // Fetch the 10 most recent sales
    include: {
      items: {
        include: {
          medication: true,
        },
      },
    },
  });
}
