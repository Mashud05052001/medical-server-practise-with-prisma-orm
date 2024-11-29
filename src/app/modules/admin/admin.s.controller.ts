import { TObject } from "../../interface/commonTypes";
import { catchAsync } from "../../utils/catchAsync";
import pick from "../../utils/pick";
import { SendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";

const getAllAdmins = catchAsync(async (req, res) => {
  const filter = pick(req?.query, ["name", "email", "searchTerm"]);
  const paginateOptions = pick(req?.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const result = await AdminService.getAllAdmins(filter, paginateOptions);
  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All admins retrived successfully",
    meta: result.meta,
    data: result?.data,
  });
});

const getAdminById = catchAsync(async (req, res) => {
  const result = await AdminService.getAdminById(req.params?.id);

  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data retrived successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const result = await AdminService.updateAdmin(req.params?.id, req?.body);

  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data updated successfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const result = await AdminService.deleteAdmin(req.params?.id);

  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data deleted successfully",
    data: result,
  });
});

const softDeleteAdmin = catchAsync(async (req, res) => {
  const result = await AdminService.softDeleteAdmin(req.params?.id);

  SendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data deleted successfully",
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
