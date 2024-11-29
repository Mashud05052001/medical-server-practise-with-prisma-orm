import { NextFunction, Request, Response, Router } from "express";
import { AdminController } from "./admin.s.controller";
import { AnyZodObject, z } from "zod";
import { AdminValidation } from "./admin.validation";
import validateRequest from "../../middleware/validateRequest";
import auth from "../../middleware/auth";

const router = Router();

router.get("/", auth("ADMIN", "SUPER_ADMIN"), AdminController.getAllAdmins);
router.get("/:id", AdminController.getAdminById);
router.patch(
  "/:id",
  validateRequest(AdminValidation.updateAdminValidationSchema),
  AdminController.updateAdmin
);
router.delete("/:id", AdminController.deleteAdmin);
router.delete("/soft/:id", AdminController.softDeleteAdmin);

export const AdminRoutes = router;
