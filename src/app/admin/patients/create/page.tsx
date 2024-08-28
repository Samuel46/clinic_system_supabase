import { PatientForm } from "@/components/patients";
import { getCurrentUser } from "@lib/session";
import React from "react";

export default async function CreatePatientPage() {
  const user = await getCurrentUser();
  return <PatientForm user={user} />;
}
