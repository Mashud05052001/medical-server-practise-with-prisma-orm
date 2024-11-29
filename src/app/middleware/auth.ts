import { UserRole } from "@prisma/client";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { jwtHelpers } from "../helpers/jwtManager";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../config";

const auth = (...providedRoles: UserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authorization Failed!");
    }
    const verifiedUser = jwtHelpers.varifyAccessToken(token);
    if (providedRoles.length && !providedRoles.includes(verifiedUser?.role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authorization Failed!");
    }
    const userData = await prisma.user.findUnique({
      where: { email: verifiedUser?.email },
    });
    if (!userData) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authorization Failed!");
    } else if (userData?.status === "DELETED") {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Authorization Failed! User has deleted"
      );
    }
    req.userAllData = userData;
    req.user = verifiedUser;
    next();
  });
};

export default auth;
