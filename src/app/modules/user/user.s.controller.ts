import httpStatus from "http-status";
import { TImageFile } from "../../interface/imageFileType";
import { catchAsync } from "../../utils/catchAsync";
import pick from "../../utils/pick";
import { SendResponse } from "../../utils/sendResponse";
import { userFilterableFields } from "./user.constant";
import { UserService } from "./user.service";

const createAdmin = catchAsync(async (req, res, next) => {
  const result = await UserService.createAdmin(
    req?.body,
    req?.file as TImageFile
  );
  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req, res) => {
  const result = await UserService.createDoctor(
    req?.body,
    req?.file as TImageFile
  );
  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const createPatient = catchAsync(async (req, res) => {
  const result = await UserService.createPatient(
    req?.body,
    req?.file as TImageFile
  );
  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const filter = pick(req?.query, userFilterableFields);
  const paginateOptions = pick(req?.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const result = await UserService.getAllUsers(filter, paginateOptions);
  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All users retrived successfully",
    meta: result.meta,
    data: result?.data,
  });
});

const changeProfileStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.changeProfileStatus(id, req.body);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users profile status changed!",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const result = await UserService.getMyProfile(req.userAllData);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My profile data fetched!",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const result = await UserService.updateMyProfie(req.userAllData, req);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

export const UserController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
