import { z } from "zod";
import AppError from "../../errors/AppError";

const createAdminValidationSchema = z.object({
  body: z.object({
    // Define your validation creat rules here
  }),
});

const updateAdminValidationSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      contactNumber: z.string().optional(),
    })
    .refine((data) => {
      if (Object.keys(data).length === 0)
        throw new AppError(400, "Please provide at least 1 update data");
      return data;
    }),
});

export const AdminValidation = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
