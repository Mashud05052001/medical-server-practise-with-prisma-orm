import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { SpecialitiesService } from "./specialities.service";
import { TImageFile } from "../../interface/imageFileType";
import { SendResponse } from "../../utils/sendResponse";

const inserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialitiesService.inserIntoDB(
    req.body,
    req?.file as TImageFile
  );

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties created successfully!",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await SpecialitiesService.getAllFromDB();
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialties data fetched successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SpecialitiesService.deleteFromDB(id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Specialty deleted successfully",
    data: result,
  });
});

export const SpecialtiesController = {
  inserIntoDB,
  getAllFromDB,
  deleteFromDB,
};
