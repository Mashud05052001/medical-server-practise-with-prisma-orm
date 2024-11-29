import express, { NextFunction, Request, Response } from "express";
import { SpecialtiesController } from "./specialities.s.controller";
import { multerImageUpload } from "../../utils/imageUploader";
import parseData from "../../utils/parseData";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { SpecialtiesValidtaion } from "./specialities.validation";

const router = express.Router();

router.get("/", SpecialtiesController.getAllFromDB);

router.post(
  "/",
  auth("ADMIN", "SUPER_ADMIN"),
  multerImageUpload.single("file"),
  parseData,
  validateRequest(SpecialtiesValidtaion.create),
  SpecialtiesController.inserIntoDB
);

router.delete(
  "/:id",
  auth("ADMIN", "SUPER_ADMIN"),
  SpecialtiesController.deleteFromDB
);

export const SpecialitiesRoutes = router;
