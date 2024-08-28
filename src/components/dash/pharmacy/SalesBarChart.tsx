"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@ui/chart";
import { format } from "date-fns";
import { getDateRange, getMonthsCount } from "@utils/chart";

const chartConfig = {
  total: {
    label: "Total Sales",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface SalesData {
  month: string;
  total: number;
}

interface Props {
  salesData: SalesData[];
  percentageChange: number | null;

  firstSaleDate: Date | null;
}

export default function SalesBarChart({
  salesData,
  percentageChange,
  firstSaleDate,
}: Props) {
  const dateRange = getDateRange(firstSaleDate!);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Distribution</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={salesData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => format(new Date(value), "MMM")}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="total" fill="var(--chart-1)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {percentageChange !== null && (
            <>
              Trending {percentageChange >= 0 ? "up" : "down"} by{" "}
              {percentageChange.toFixed(2)}% this month <TrendingUp className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sales for the last {getMonthsCount(firstSaleDate!)} months
        </div>
      </CardFooter>
    </Card>
  );
}
