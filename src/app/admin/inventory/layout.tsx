import { InventoryNavigation } from "@/components/inventory";
import React from "react";

export default async function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <InventoryNavigation />

      {children}
    </div>
  );
}
