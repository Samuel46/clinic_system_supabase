import { Badge } from "@/components/badge";
import { InventoryNavigation } from "@/components/inventory";
import { cn } from "@lib/utils";
import React from "react";

const stats = [
  { name: "Medication", value: "49", change: "+4.75%", changeType: "positive" },
  {
    name: "Supplies",
    value: "4993",
    change: "+54.02%",
    changeType: "negative",
  },
];
export default async function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" space-y-6">
      <dl className="mx-auto grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
          >
            <dt className="text-sm font-medium leading-6 text-gray-500">{stat.name}</dt>
            <Badge color={stat.changeType === "negative" ? "rose" : "lime"}>
              {stat.change}
            </Badge>

            <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      <InventoryNavigation />

      {children}
    </div>
  );
}
