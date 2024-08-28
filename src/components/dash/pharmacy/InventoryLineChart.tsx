"use client";

import React from "react";
import { CartesianGrid, Line, LineChart, XAxis, ResponsiveContainer } from "recharts";
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
import { format, parse } from "date-fns";

interface InventoryData {
  month: string;
  medication: string;
  quantity: number;
}

interface ChartData {
  month: string;
  [key: string]: any;
}

interface InventoryLineChartProps {
  inventoryData: InventoryData[];
}

const InventoryLineChart: React.FC<InventoryLineChartProps> = ({ inventoryData }) => {
  // Transform the data for the chart
  const data = inventoryData.reduce((acc, { month, medication, quantity }) => {
    let monthData = acc.find((d) => d.month === month);
    if (!monthData) {
      monthData = { month } as ChartData;
      acc.push(monthData);
    }
    monthData[medication] = quantity;
    return acc;
  }, [] as ChartData[]);

  const medications = Array.from(new Set(inventoryData.map((item) => item.medication)));

  // Define the chart configuration
  const chartConfig: ChartConfig = medications.reduce((config, medication, index) => {
    config[medication] = {
      label: medication,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return config;
  }, {} as ChartConfig);

  // Calculate the date range for the chart description
  const startDate =
    inventoryData.length > 0
      ? format(parse(inventoryData[0].month, "yyyy-MM", new Date()), "MMMM yyyy")
      : "Start";
  const endDate =
    inventoryData.length > 0
      ? format(
          parse(inventoryData[inventoryData.length - 1].month, "yyyy-MM", new Date()),
          "MMMM yyyy"
        )
      : "End";
  const dateRange = `${startDate} - ${endDate}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Levels</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  format(parse(value, "yyyy-MM", new Date()), "MMM")
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              {medications.map((medication, index) => (
                <Line
                  key={medication}
                  dataKey={medication}
                  type="natural"
                  stroke={`hsl(var(--chart-${index + 1}))`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing inventory levels for various medications over time
        </div>
      </CardFooter>
    </Card>
  );
};

export default InventoryLineChart;
