import { TreatmentType } from "@prisma/client";
import { z } from "zod";

export const treatmentSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string().min(1, { message: "Tenant ID is required" }),
  name: z.string().min(1, { message: "Treatment name is required" }),
  patientId: z.string().optional(),
  doctorId: z.string().min(1, { message: "Doctor ID is required" }),
  appointmentId: z.string().optional(),
  procedureId: z.string().optional(),
  medicalRecordId: z.string().optional(),
  treatmentDate: z.date(),
  type: z.nativeEnum(TreatmentType),
  description: z.string().min(1, "Treatment description is required"),
});

export const createTreatmentComponents = z.object({
  componentId: z.string({ required_error: "Component Id is required!" }),
  quantity: z
    .number({ required_error: "Quantity is required!" })
    .positive({ message: "Must be greater than 0" }),
});

export const upsertTreatmentEquipments = z.object({
  treatmentEquipments: z.array(createTreatmentComponents).optional(),
});

export const createTreatmentSchema = treatmentSchema.omit({
  treatmentDate: true,
});

export const updateTreatmentSchema = treatmentSchema.partial();

export type TreatmentInput = z.infer<typeof treatmentSchema>;
export type CreateTreatmentComponentInput = z.infer<typeof createTreatmentComponents>;
export type UpsertTreatmentEquipments = z.infer<typeof upsertTreatmentEquipments>;
export type CreateTreatmentInput = z.infer<typeof createTreatmentSchema>;
export type UpdateTreatmentInput = z.infer<typeof updateTreatmentSchema>;
