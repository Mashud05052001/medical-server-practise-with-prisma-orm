import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { TLoginPayload } from "./auth.constant";
import { AuthService } from "./auth.service";
import { SendResponse } from "../../utils/sendResponse";
import config from "../../config";

const login = catchAsync(async (req, res, next) => {
  const { accessToken, refreshToken, needPasswordChange } =
    await AuthService.login(req?.body as TLoginPayload);
  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
    sameSite: true,
    maxAge: 90 * 24 * 60 * 60 * 1000,
  });
  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successfully",
    data: {
      accessToken,
      needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req, res, next) => {
  console.log(req?.cookies);
  const result = await AuthService.refreshToken(req?.cookies?.refreshToken);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token retrieved successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res, next) => {
  const result = await AuthService.changePassword(req.body, req?.userAllData);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  const result = await AuthService.forgotPassword(req.body);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Forgot password email sent successfully",
    data: result,
  });
});
const resetPassword = catchAsync(async (req, res, next) => {
  const result = await AuthService.resetPassword(req.body);

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully",
    data: result,
  });
});

export const AuthController = {
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
