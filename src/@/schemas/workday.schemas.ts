import { z } from "zod";
import { DayOfWeek } from "@prisma/client";

export const createWorkDaySchema = z
  .object({
    day: z.nativeEnum(DayOfWeek, {
      required_error: "Day of the week is required",
    }),
    startTime: z.date({
      required_error: "Start time is required",
    }),
    endTime: z.date({
      required_error: "End time is required",
    }),
    scheduleId: z.string().uuid("Schedule ID must be a valid UUID"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const updateWorkDaySchema = createWorkDaySchema.optional();

export type CreateWorkDayInput = z.infer<typeof createWorkDaySchema>;
export type UpdateWorkDayInput = z.infer<typeof updateWorkDaySchema>;
