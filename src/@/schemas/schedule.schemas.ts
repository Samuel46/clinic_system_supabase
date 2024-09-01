// src/schemas/scheduleSchemas.ts
import { DayOfWeek } from "@prisma/client";
import { z } from "zod";

export const workDaySchema = z
  .object({
    day: z.nativeEnum(DayOfWeek, {
      required_error: "Day of the week is required",
    }),
    startTime: z.date({
      required_error: "Start time is required",
      invalid_type_error: "Start time must be a valid date",
    }),
    endTime: z.date({
      required_error: "End time is required",
      invalid_type_error: "End time must be a valid date",
    }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const createDayOffSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(1, { message: "Name is required" }),
  date: z.date({
    required_error: "Date is required",
  }),
  reason: z.string().optional(),
  // scheduleId: z.string().uuid("Schedule ID must be a valid UUID"),
});

export const createScheduleSchema = z.object({
  workDays: z
    .array(workDaySchema, {
      required_error: "Work days are required",
      invalid_type_error: "Work days must be an array of valid work day objects",
    })
    .nonempty("At least one work day is required"),
  userId: z.string().uuid("User ID must be a valid UUID").optional(),
  daysOff: z.array(createDayOffSchema).optional(),
});

export const updateScheduleSchema = createScheduleSchema.optional();

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
