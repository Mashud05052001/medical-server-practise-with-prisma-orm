import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(4).max(30),
  }),
});
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(4).max(30),
    newPassword: z.string().min(4).max(30),
  }),
});
const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});
const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(4).max(30),
    token: z.string(),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  changePasswordValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
