"use client";

import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";
import { Skeleton } from "@ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="space-y-6 mx-auto pt-6 px-4 w-full">
      {/* Breadcrumb skeleton */}

      <DynamicBreadcrumb />

      {/* Title skeleton */}
      <Skeleton className="h-4 w-64 mb-8" />

      {/* Steps skeleton */}
      <div className="space-y-4 mb-6">
        <Skeleton className="h-2 w-16 mb-4" />
        {[1].map((_, index) => (
          <div key={index} className="grid grid-cols-1 gap-4 items-center mb-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Add button skeleton */}
      <Skeleton className="h-10 w-20 mb-8" />

      {/* Update steps button skeleton */}
      <div className="flex justify-end mb-8">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Divider skeleton */}
      <Skeleton className="h-px w-full mb-8" />

      {/* Continue button skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-12 w-32 rounded-md" />
      </div>
    </div>
  );
}
