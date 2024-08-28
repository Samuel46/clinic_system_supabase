import { Badge } from "@/components/badge";
import { Divider } from "@/components/divider";
import { fetchTopSellingMedication } from "@services/medications.service";
import { fetchMonthlySalesData, fetchWeeklySalesData } from "@services/sales.service";
import { formatAmountKsh } from "@utils/formatNumber";
import React from "react";

export function Stat({
  title,
  value,
  change,
  period = "week",
}: {
  title: string;
  value: string;
  change: string;
  period?: string;
}) {
  return (
    <div>
      <Divider />
      <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
      <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
      <div className="mt-3 text-sm/6 sm:text-xs/6">
        <Badge color={change.startsWith("+") ? "lime" : "pink"}>{change}</Badge>{" "}
        <span className="text-zinc-500">from last {period}</span>
      </div>
    </div>
  );
}
export default async function PharmacyStats() {
  const { currentWeekSales, previousWeekSales } = await fetchWeeklySalesData();
  const { currentMonthSales, previousMonthSales } = await fetchMonthlySalesData();

  const weeklyChange = ((currentWeekSales - previousWeekSales) / previousWeekSales) * 100;
  const monthlyChange =
    ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100;

  const topSelling = await fetchTopSellingMedication();

  return (
    <div className=" flex flex-col space-y-3 w-full col-span-2">
      <Stat
        title="This Week Revenue"
        value={formatAmountKsh(currentWeekSales)}
        change={`${weeklyChange >= 0 ? "+" : ""}${weeklyChange.toFixed(2)}%`}
      />
      <Stat
        title="This Month Revenue"
        value={formatAmountKsh(currentMonthSales)}
        period="month"
        change={`${monthlyChange >= 0 ? "+" : ""}${monthlyChange.toFixed(2)}%`}
      />

      {topSelling.medication && topSelling.medication !== "Unknown" && (
        <div>
          <Divider />
          <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">
            Top-Selling Medication
          </div>
          <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">
            {topSelling.medication}
          </div>
          <div className="mt-3 text-sm/6 sm:text-xs/6">
            <Badge color={"lime"}>+{topSelling.totalQuantity}</Badge>{" "}
            <span className="text-zinc-500">Unit sold this month</span>
          </div>
        </div>
      )}
    </div>
  );
}
