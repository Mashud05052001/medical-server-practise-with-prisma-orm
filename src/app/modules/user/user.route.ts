import { NextFunction, Request, Response, Router } from "express";
import { multerImageUpload } from "../../utils/imageUploader";
import { UserController } from "./user.s.controller";
import auth from "../../middleware/auth";
import parseData from "../../utils/parseData";
import validateRequest from "../../middleware/validateRequest";
import { userValidation } from "./user.validation";

const router = Router();

router.get("/", auth("ADMIN", "SUPER_ADMIN"), UserController.getAllUsers);

router.get(
  "/me",
  auth("ADMIN", "SUPER_ADMIN", "PATIENT", "DOCTOR"),
  UserController.getMyProfile
);
router.patch(
  "/update-my-profile",
  auth("ADMIN", "SUPER_ADMIN", "PATIENT", "DOCTOR"),
  multerImageUpload.single("file"),
  parseData,
  UserController.updateMyProfile
);

router.post(
  "/create-admin",
  auth("ADMIN", "SUPER_ADMIN"),
  multerImageUpload.single("file"),
  parseData,
  UserController.createAdmin
);

router.post(
  "/create-doctor",
  auth("ADMIN", "SUPER_ADMIN"),
  multerImageUpload.single("file"),
  parseData,
  UserController.createDoctor
);
router.post(
  "/create-patient",
  multerImageUpload.single("file"),
  parseData,
  UserController.createPatient
);

router.patch(
  "/status/:id",
  auth("ADMIN", "SUPER_ADMIN"),
  validateRequest(userValidation.updateStatus),
  UserController.changeProfileStatus
);

export const UserRoutes = router;
