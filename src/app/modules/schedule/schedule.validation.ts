import { z } from "zod";

const createScheduleByAdmin = z.object({
  body: z.object({
    startDate: z
      .string()
      .refine(
        (value) => !isNaN(new Date(value).getTime()),
        "startDate must be a valid date in YYYY-MM-DD format."
      ),
    endDate: z
      .string()
      .refine(
        (value) => !isNaN(new Date(value).getTime()),
        "endDate must be a valid date in YYYY-MM-DD format."
      ),
    startTime: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "startTime must be in HH:mm 24-hour format."
      ),
    endTime: z
      .string()
      .regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "endTime must be in HH:mm 24-hour format."
      ),
  }),
});

export const ScheduleValidation = {
  createScheduleByAdmin,
};
