import { z } from "zod";
import { AppointmentStatus } from "@prisma/client";

export const createAppointmentSchema = z
  .object({
    tenantId: z.string().min(1, { message: "Tenant ID is required" }),
    patientId: z.string().min(1, { message: "Patient ID is required" }),
    doctorId: z.string().min(1, { message: "Doctor ID is required" }),
    date: z.date({ message: "Date is required" }),
    startTime: z.date({
      required_error: "Start time is required",
      invalid_type_error: "Invalid date format",
    }),
    endTime: z.date({
      required_error: "End time is required",
      invalid_type_error: "Invalid date format",
    }),
    reason: z.string().min(1, { message: "Reason is required" }),
    status: z.nativeEnum(AppointmentStatus),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const updateAppointmentStatusSchema = z.object({
  id: z.string().min(1, "Appointment ID is required"),
  status: z.enum(["COMPLETED"]).default("COMPLETED"),
});

export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
