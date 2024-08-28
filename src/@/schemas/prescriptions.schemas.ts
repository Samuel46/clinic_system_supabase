import { Dosage, Duration, Frequency } from "@prisma/client";
import { z } from "zod";

export const prescriptionSchema = z.object({
  tenantId: z.string().min(1, { message: "Tenant ID is required" }),
  patientId: z.string().min(1, { message: "Patient ID is required" }),
  doctorId: z.string().min(1, { message: "Doctor ID is required" }),
  treatmentId: z.string().optional(),
  medicationId: z.string().min(1, { message: "Medication ID is required" }),
  dosage: z.nativeEnum(Dosage),
  frequency: z.nativeEnum(Frequency),
  duration: z.nativeEnum(Duration),
  instructions: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Schema for creating a new Prescription
export const createPrescriptionSchema = prescriptionSchema.omit({
  createdAt: true,
  updatedAt: true,
});

// Schema for updating a Prescription
export const updatePrescriptionSchema = prescriptionSchema.partial();

// Types inferred from the Zod schemas
export type Prescription = z.infer<typeof prescriptionSchema>;
export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>;
export type UpdatePrescriptionInput = z.infer<typeof updatePrescriptionSchema>;
