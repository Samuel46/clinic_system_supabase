import { differenceInMonths, format, startOfMonth } from "date-fns";

export function getDateRange(firstSaleDate: Date): string {
  const now = new Date();
  const startMonthName = format(firstSaleDate, "MMMM");
  const endMonthName = format(now, "MMMM");
  const year = format(now, "yyyy");

  return `${startMonthName} - ${endMonthName} ${year}`;
}

export function getMonthsCount(firstSaleDate: Date): number {
  const now = new Date();
  return differenceInMonths(now, startOfMonth(firstSaleDate)) + 1;
}

export function calculatePercentageChange(
  currentMonthSales: number,
  previousMonthSales: number
): number {
  if (previousMonthSales === 0) return 0;
  return ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100;
}
