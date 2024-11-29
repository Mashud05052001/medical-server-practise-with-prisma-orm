import { User, UserStatus } from "@prisma/client";
import config, { prisma } from "../../config";
import AppError from "../../errors/AppError";
import { jwtHelpers } from "../../helpers/jwtManager";
import { bcryptHelpers } from "../../helpers/passwordManage";
import {
  TChangePassPayload,
  TForgotPassword,
  TLoginPayload,
  TResetPassword,
} from "./auth.constant";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";

const login = async (payload: TLoginPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found. Please register first."
    );
  }
  if (user.status === UserStatus.DELETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The user has been deleted. Again try to register"
    );
  }
  const isPasswordValid = await bcryptHelpers.compareHashedCode(
    payload.password,
    user.password
  );
  if (!isPasswordValid) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password!");
  }

  const decodeData = {
    email: user.email,
    role: user.role,
  };
  const accessToken = jwtHelpers.createAccessToken(decodeData);
  const refreshToken = jwtHelpers.createRefreshToken(decodeData);

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  const decodedData = jwtHelpers.varifyRefreshToken(token) as JwtPayload;
  const user = await prisma.user.findUnique({
    where: { email: decodedData?.email },
  });
  if (user?.status === UserStatus.DELETED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "The user has been deleted. Again try to register"
    );
  }
  const { email, role } = decodedData;
  const accessToken = jwtHelpers.createAccessToken({ email, role });

  return accessToken;
};

const changePassword = async (payload: TChangePassPayload, userData: User) => {
  console.log(userData);
  const isOldPassordValid = await bcryptHelpers.compareHashedCode(
    payload.oldPassword,
    userData.password
  );
  if (!isOldPassordValid) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password doesn't matched!");
  }
  const newHashedPassword = await bcryptHelpers.createHashedCode(
    payload.newPassword
  );
  await prisma.user.update({
    where: { email: userData.email },
    data: { password: newHashedPassword },
  });
  return null;
};

const forgotPassword = async (payload: TForgotPassword) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email, status: UserStatus.ACTIVE },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }
  const decodedData = { email: user.email, role: user.role };
  const resetPasswordToken = jwtHelpers.customExpiresInAccessToken(
    decodedData,
    "10m"
  );
  // url = frontend_url/reset-pass?email=masudmahi05@gmail.com&token=..................
  const resetPasswordLink = `${config.reset_password_url}?userId =${user.email}&token=${resetPasswordToken}`;
  return resetPasswordLink;
};

const resetPassword = async (payload: TResetPassword) => {
  const decodedUser = jwtHelpers.varifyAccessToken(payload.token);
  if (!decodedUser) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Token expired. Please again request for forgot password"
    );
  } else if (decodedUser?.email !== payload?.email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please send request again for password resetting"
    );
  }
  const hashedPassword = await bcryptHelpers.createHashedCode(payload.password);
  await prisma.user.update({
    where: { email: payload.email, status: "ACTIVE" },
    data: { password: hashedPassword },
  });
  return null;
};

export const AuthService = {
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
