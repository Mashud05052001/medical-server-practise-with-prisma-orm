import express from "express";
import { UserRole } from "@prisma/client";
import { DoctorController } from "./doctor.s.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { DoctorValidation } from "./doctor.validation";

const router = express.Router();

router.get("/", DoctorController.getAllFromDB);

router.get("/:id", DoctorController.getByIdFromDB);

router.patch(
  "/:id",
  auth("SUPER_ADMIN", "ADMIN", "DOCTOR"),
  validateRequest(DoctorValidation.update),
  DoctorController.updateIntoDB
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.deleteFromDB
);

router.delete(
  "/soft/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  DoctorController.softDelete
);

export const DoctorRoutes = router;
