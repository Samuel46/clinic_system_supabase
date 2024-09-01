import { z } from "zod";

export const createDayOffSchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  date: z.date({
    required_error: "Date is required",
  }),
  reason: z.string().optional(),
  scheduleId: z.string().uuid("Schedule ID must be a valid UUID"),
});

export const updateDayOffSchema = createDayOffSchema.optional();

export type CreateDayOffInput = z.infer<typeof createDayOffSchema>;
