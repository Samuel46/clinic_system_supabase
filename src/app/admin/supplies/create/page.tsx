import { SuppliesForm } from "@/components/supplies";
import { getCurrentUser } from "@lib/session";
import React from "react";

export default async function SuppliesPage() {
  const user = await getCurrentUser();

  return <SuppliesForm user={user} />;
}
