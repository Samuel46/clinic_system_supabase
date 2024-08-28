import { z } from "zod";

export const medicalCheckupSchema = z.object({
  tenantId: z.string().min(1, "Tenant ID is required"),
  patientId: z.string().min(1, "Patient ID is required"),
  doctorId: z.string().min(1, "Doctor ID is required"),
  appointmentId: z.string().optional(),
  checkupDate: z.date(),
  bloodPressure: z.string().min(1, "Blood pressure is required"), // e.g., "120/80 mmHg"
  heartRate: z.number().int(), // e.g., 72 bpm
  respiratoryRate: z.number().int().optional(), // e.g., 16 breaths per minute
  temperature: z.number().optional(), // e.g., 98.6 °F
  oxygenSaturation: z.number().int().optional(), // e.g., 98 %
  weight: z
    .number({ message: "Weight is required" })
    .positive({ message: "Weight must be a non-negative integer greater than 0." }), // Optional
  height: z.number().optional(), // Optional
  bmi: z.number().optional(), // Optional
  notes: z.string().optional(), // Optional field for additional notes
});

export const createMedicalCheckupSchema = medicalCheckupSchema.omit({
  checkupDate: true,
});

export const updateMedicalCheckupSchema = medicalCheckupSchema.partial();

export type MedicalCheckup = z.infer<typeof medicalCheckupSchema>;
export type CreateMedicalCheckupInput = z.infer<typeof createMedicalCheckupSchema>;
export type UpdateMedicalCheckupInput = z.infer<typeof updateMedicalCheckupSchema>;
