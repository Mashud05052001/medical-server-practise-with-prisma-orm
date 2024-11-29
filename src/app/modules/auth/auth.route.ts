import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.validation";
import { AuthController } from "./auth.s.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login
);

router.post("/refresh-token", AuthController.refreshToken);
router.post(
  "/change-password",
  auth("ADMIN", "DOCTOR", "PATIENT", "SUPER_ADMIN"),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);
router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword
);

export const AuthRoutes = router;
