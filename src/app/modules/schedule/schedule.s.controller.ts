import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { SendResponse } from "../../utils/sendResponse";
import { ScheduleService } from "./schedule.service";

const createScheduleByAdmin = catchAsync(async (req, res) => {
  const result = await ScheduleService.createScheduleByAdmin(req.body);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Schedule is created successfully",
    data: result,
  });
});

export const ScheduleController = {
  createScheduleByAdmin,
};
