import { z } from "zod";

export const treatmentSchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required"),
  patientId: z.string().min(1, "Patient ID is required"),
  doctorId: z.string().min(1, "Doctor ID is required"),
  appointmentId: z.string().optional(),
  medicalRecordId: z.string().optional(),
  treatmentDate: z.date(),
  type: z.enum(["MEDICATION", "THERAPY", "SURGERY", "OTHER"]),
  description: z.string().min(1, "Treatment description is required"),
});

export const createTreatmentSchema = treatmentSchema.omit({
  treatmentDate: true,
});

export const updateTreatmentSchema = treatmentSchema.partial();

export type TreatmentInput = z.infer<typeof treatmentSchema>;
export type CreateTreatmentInput = z.infer<typeof createTreatmentSchema>;
export type UpdateTreatmentInput = z.infer<typeof updateTreatmentSchema>;
