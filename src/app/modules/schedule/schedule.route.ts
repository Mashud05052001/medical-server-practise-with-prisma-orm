import { Router } from "express";
import { ScheduleController } from "./schedule.s.controller";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { ScheduleValidation } from "./schedule.validation";

const router = Router();

router.post(
  "/",
  auth("ADMIN", "SUPER_ADMIN"),
  validateRequest(ScheduleValidation.createScheduleByAdmin),
  ScheduleController.createScheduleByAdmin
);

export const ScheduleRoutes = router;
