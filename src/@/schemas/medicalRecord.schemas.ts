import { z } from "zod";

import { FollowUpPeriod } from "@prisma/client";

export const medicalRecordSchema = z.object({
  tenantId: z.string().min(1, { message: "Tenant ID is required" }),
  patientId: z.string().min(1, { message: "Patient ID is required" }),
  doctorId: z.string().min(1, { message: "Doctor ID is required" }),
  appointmentId: z.string().optional(),
  checkupId: z.string().optional(),
  treatmentId: z.string().optional(),

  reasonForVisit: z.string().min(1, { message: "Reason for visit is required" }),
  updateAt: z.date(),
  followUp: z.nativeEnum(FollowUpPeriod),
});

export const createMedicalRecordSchema = medicalRecordSchema.omit({
  updateAt: true,
});

export const updateMedicalRecordSchema = medicalRecordSchema.partial();

export type MedicalRecord = z.infer<typeof medicalRecordSchema>;
export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>;
export type UpdateMedicalRecordInput = z.infer<typeof updateMedicalRecordSchema>;
