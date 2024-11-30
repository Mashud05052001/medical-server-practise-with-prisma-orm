import { prisma } from "../../config";
import { bcryptHelpers } from "../../helpers/passwordManage";
import { TObject } from "../../interface/commonTypes";

import { Admin, Prisma, User, UserRole, UserStatus } from "@prisma/client";
import { TImageFile } from "../../interface/imageFileType";
import { cloudinaryUpload } from "../../utils/imageUploader";
import { TCreateAdmin, TCreateDoctor, TCreatePatient } from "./user.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { TPaginationOptions } from "../../interface/pagination";
import { calculatePagination } from "../../helpers/paginationHelpers";
import { userSearchableFields } from "./user.constant";
import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

const createAdmin = async (payload: TCreateAdmin, imageFile: TImageFile) => {
  const isExist = await prisma.user.findUnique({
    where: { email: payload?.admin.email },
  });

  if (isExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This email already has an account in ${isExist.role} section`
    );
  }

  const imgLink = await cloudinaryUpload(imageFile);
  const hashedPassword = await bcryptHelpers.createHashedCode(
    payload.password as string
  );

  const userData = {
    email: payload?.admin?.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const adminData = { ...payload.admin, profilePhoto: imgLink };
  const result = prisma.$transaction(async (tsx) => {
    await tsx.user.create({ data: userData });
    const createdAdminData = await tsx.admin.create({ data: adminData });
    return createdAdminData;
  });
  return result;
};
const createDoctor = async (payload: TCreateDoctor, imageFile: TImageFile) => {
  const isExist = await prisma.user.findUnique({
    where: { email: payload?.doctor.email },
  });

  if (isExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This email already has an account in ${isExist.role} section`
    );
  }

  const imgLink = await cloudinaryUpload(imageFile);
  const hashedPassword = await bcryptHelpers.createHashedCode(
    payload.password as string
  );

  const userData = {
    email: payload?.doctor?.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };
  const doctorData = { ...payload.doctor, profilePhoto: imgLink };

  const result = prisma.$transaction(async (tsx) => {
    await tsx.user.create({ data: userData });
    const createdAdminData = await tsx.doctor.create({ data: doctorData });
    return createdAdminData;
  });
  return result;
};
const createPatient = async (
  payload: TCreatePatient,
  imageFile: TImageFile
) => {
  const isExist = await prisma.user.findUnique({
    where: { email: payload?.patient.email },
  });

  if (isExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      `This email already has an account in ${isExist.role} section`
    );
  }

  const imgLink = await cloudinaryUpload(imageFile);
  const hashedPassword = await bcryptHelpers.createHashedCode(
    payload.password as string
  );

  const userData = {
    email: payload?.patient?.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };
  const patientData = { ...payload.patient, profilePhoto: imgLink };

  const result = prisma.$transaction(async (tsx) => {
    await tsx.user.create({ data: userData });
    const createdAdminData = await tsx.patient.create({ data: patientData });
    return createdAdminData;
  });
  return result;
};

const getAllUsers = async (
  params: any,
  paginateOptions: TPaginationOptions
) => {
  const { skip, page, limit, sortBy, sortOrder } =
    calculatePagination(paginateOptions);
  const { searchTerm, ...otherParams } = params;
  const andConditions: Prisma.UserWhereInput[] = [];

  if (params?.searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: params?.searchTerm as string,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(otherParams).length) {
    andConditions.push({
      AND: Object.keys(otherParams).map((key) => ({
        [key]: {
          equals: (otherParams as any)[key],
        },
      })),
    });
  }

  console.dir(andConditions, { depth: "Infinity" });
  const result = await prisma.user.findMany({
    where: { AND: andConditions },
    take: limit,
    skip,
    orderBy: { [sortBy]: sortOrder },
    include: {
      Admin: true,
      Doctor: true,
      Patient: true,
    },
  });
  const total = await prisma.user.count({
    where: { AND: andConditions },
  });
  return {
    meta: { page, limit, total },
    data: result,
  };
};

const changeProfileStatus = async (id: string, status: UserRole) => {
  const userData = await prisma.user.findUnique({
    where: { id },
  });
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const updateUserStatus = await prisma.user.update({
    where: { id },
    data: status,
  });

  return updateUserStatus;
};

const getMyProfile = async (userInfo: User) => {
  if (userInfo.status !== "ACTIVE") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to get data! This user is ${userInfo.status}`
    );
  }

  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: { email: userInfo.email },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: { email: userInfo.email },
    });
  } else if (userInfo.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findUnique({
      where: { email: userInfo.email },
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: { email: userInfo.email },
    });
  }

  return { ...userInfo, ...profileInfo, password: null };
};

const updateMyProfie = async (userInfo: User, req: Request) => {
  if (userInfo.status !== "ACTIVE") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Failed to update data! This user is ${userInfo.status}`
    );
  }

  const file = req.file as TImageFile;
  if (file) {
    const uploadToCloudinary = await cloudinaryUpload(file);
    req.body.profilePhoto = uploadToCloudinary;
  }

  let profileInfo;

  switch (userInfo.role) {
    case "ADMIN":
      profileInfo = await prisma.admin.update({
        where: { email: userInfo.email },
        data: req.body,
      });
      break;
    case "DOCTOR":
      profileInfo = await prisma.doctor.update({
        where: { email: userInfo.email },
        data: req.body,
      });
      break;
    case "PATIENT":
      profileInfo = await prisma.patient.update({
        where: { email: userInfo.email },
        data: req.body,
      });
      break;
    case "SUPER_ADMIN":
      profileInfo = await prisma.admin.update({
        where: { email: userInfo.email },
        data: req.body,
      });
      break;

    default:
      break;
  }

  return { ...profileInfo };
};

export const UserService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  changeProfileStatus,
  getMyProfile,
  updateMyProfie,
};
