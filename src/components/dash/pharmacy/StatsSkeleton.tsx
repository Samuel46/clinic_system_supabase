import { Divider } from "@/components/divider";

import { Skeleton } from "@ui/skeleton";

import React from "react";

export function Stat() {
  return (
    <div>
      <Divider />
      <Skeleton className="mt-6 h-[10px] w-[250px]"></Skeleton>
      <Skeleton className="mt-3 h-[40px] w-[250px]"></Skeleton>
      <Skeleton className="mt-3 h-[10px] w-[250px]"></Skeleton>
    </div>
  );
}
export default function StatsSkeleton() {
  return (
    <div className=" flex flex-col space-y-3 w-full col-span-2">
      <Stat />
      <Stat />

      <Stat />
    </div>
  );
}
