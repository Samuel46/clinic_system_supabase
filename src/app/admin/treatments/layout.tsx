import { TreatmentNavigation } from "@/components/treatment";
import React from "react";

export default async function TreatmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="space-y-6">
      <TreatmentNavigation />

      {children}
    </main>
  );
}
