import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { DoctorService } from "./doctor.service";
import { SendResponse } from "../../utils/sendResponse";
import { doctorFilterableFields } from "./doctor.constant";
import pick from "../../utils/pick";

const getAllFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, doctorFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DoctorService.getAllFromDB(filters, options);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctors retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorService.getByIdFromDB(id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor retrieval successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorService.updateIntoDB(id, req.body);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor data updated!",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorService.deleteFromDB(id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor deleted successfully",
    data: result,
  });
});

const softDelete = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await DoctorService.softDelete(id);
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor soft deleted successfully",
    data: result,
  });
});

export const DoctorController = {
  updateIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
  softDelete,
};
