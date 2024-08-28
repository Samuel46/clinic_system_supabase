"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@ui/chart";

import { calculatePercentageChange, getDateRange, getMonthsCount } from "@utils/chart";
import { formatAmountKsh } from "@utils/formatNumber";

interface MedicationSales {
  medication: string;
  totalSales: number;
}
interface MonthlySales {
  currentMonthSales: number;
  previousMonthSales: number;
}

type Props = {
  data: MedicationSales[];
  monthlySales: MonthlySales;
  firstSaleDate: Date | null;
};

export default function MedicationDistribution({
  data,
  monthlySales,
  firstSaleDate,
}: Props) {
  const colors = Array.from(
    { length: 30 },
    (_, index) => `hsl(var(--chart-${index + 1}))`
  );

  const chartData = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));

  const chartConfig = {
    totalSales: {
      label: "Total Sales",
    },
    medications: chartData.reduce((acc, item) => {
      acc[item.medication] = {
        label: item.medication,
        color: item.fill,
      };
      return acc;
    }, {} as Record<string, { label: string; color: string }>),
  };

  const percentageChange = calculatePercentageChange(
    monthlySales.currentMonthSales,
    monthlySales.previousMonthSales
  );
  const dateRange = getDateRange(firstSaleDate!);

  return (
    <Card className="flex flex-col col-span-2 ">
      <CardHeader className="items-center pb-0">
        <CardTitle>Medication Distribution</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="totalSales"
              nameKey="medication"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending {percentageChange >= 0 ? "up" : "down"} by{" "}
          {percentageChange.toFixed(2)}% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sales for the last {getMonthsCount(firstSaleDate!)} months
        </div>
      </CardFooter>
    </Card>
  );
}
