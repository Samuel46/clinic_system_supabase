import { MedicationForm } from "@/components/medications";
import { getCurrentUser } from "@lib/session";
import React from "react";

export default async function CreateMedicationPage() {
  const user = await getCurrentUser();

  return <MedicationForm user={user} />;
}
