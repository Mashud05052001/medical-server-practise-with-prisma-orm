import { Admin, Prisma, UserStatus } from "@prisma/client";
import { prisma } from "../../config";
import { TObject } from "../../interface/commonTypes";
import { adminSearchableFields } from "./admin.constant";
import { calculatePagination } from "../../helpers/paginationHelpers";
import AppError from "../../errors/AppError";
import { TAdminFilterRequest } from "./admin.interface";
import { TPaginationOptions } from "../../interface/pagination";

const getAllAdmins = async (
  params: TAdminFilterRequest,
  paginateOptions: TPaginationOptions
) => {
  const { skip, page, limit, sortBy, sortOrder } =
    calculatePagination(paginateOptions);
  const { searchTerm, ...otherParams } = params;
  const andConditions: Prisma.AdminWhereInput[] = [];

  if (params?.searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
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

  andConditions.push({ isDeleted: false });

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  //   console.dir(andConditions, { depth: "Infinity" });
  const result = await prisma.admin.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy: { [sortBy]: sortOrder },
    // where: {
    //   OR: [
    //     {
    //       name: {
    //         contains: params?.searchTerm as string,
    //         mode: "insensitive",
    //       },
    //     },
    //     {
    //       email: {
    //         contains: params?.searchTerm as string,
    //         mode: "insensitive",
    //       },
    //     },
    //   ],
    // },
  });
  const total = await prisma.admin.count({
    where: whereConditions,
  });
  return {
    meta: { page, limit, total },
    data: result,
  };
};

const getAdminById = async (id: string): Promise<Admin> => {
  const result = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  });
  if (!result) throw new AppError(404, "Admin not found using the ID");
  return result;
};

const updateAdmin = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  const result = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  });
  if (!result) throw new AppError(404, "Admin not found using the ID");
  const result1 = await prisma.admin.update({
    where: { id, isDeleted: false },
    data,
  });
  return result1;
};

const deleteAdmin = async (id: string): Promise<Admin> => {
  const isExist = await prisma.admin.findUnique({ where: { id } });
  if (!isExist) throw new AppError(404, "Admin not found using the ID");

  const result = await prisma.$transaction(async (tsx) => {
    const adminDeletedData = await tsx.admin.delete({ where: { id } });
    await tsx.user.delete({ where: { email: adminDeletedData?.email } });

    return adminDeletedData;
  });
  return result;
};

const softDeleteAdmin = async (id: string): Promise<Admin> => {
  const isExist = await prisma.admin.findUnique({
    where: { id, isDeleted: false },
  });
  if (!isExist) throw new AppError(404, "Admin not found using the ID");

  const result = await prisma.$transaction(async (tsx) => {
    const adminDeletedData = await tsx.admin.update({
      where: { id },
      data: { isDeleted: true },
    });
    await tsx.user.update({
      where: { email: adminDeletedData?.email },
      data: { status: UserStatus.DELETED },
    });

    return adminDeletedData;
  });
  return result;
};

export const AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
