import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { TPaginationOptions } from "../../interface/pagination";
import { TDoctorFilterRequest, TDoctorUpdate } from "./doctor.interface";
import { calculatePagination } from "../../helpers/paginationHelpers";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../config";

const getAllFromDB = async (
  filters: TDoctorFilterRequest,
  options: TPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  // console.log(specialties);
  if (specialties && specialties.length > 0) {
    specialties.split(",").map((specialty) =>
      andConditions.push({
        DoctorSpecialist: {
          some: {
            Specialities: {
              title: {
                contains: specialty,
                mode: "insensitive",
              },
            },
          },
        },
      })
    );
  }
  // console.dir(andConditions, { depth: "Infinity" });

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
    include: {
      DoctorSpecialist: {
        include: {
          Specialities: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      DoctorSpecialist: {
        include: {
          Specialities: true,
        },
      },
    },
  });
  return result;
};

const updateIntoDB = async (id: string, payload: TDoctorUpdate) => {
  const { specialties, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: { id },
  });

  await prisma.$transaction(async (tsx) => {
    await tsx.doctor.update({
      where: { id },
      data: doctorData,
    });

    if (specialties && specialties.length > 0) {
      // delete specialties
      const deleteSpecialtiesIds = specialties.filter(
        (specialty) => specialty.isDeleted
      );
      //console.log(deleteSpecialtiesIds)
      for (const specialty of deleteSpecialtiesIds) {
        await tsx.doctorSpecialist.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialitiesId: specialty.specialtiesId,
          },
        });
      }
      // create specialties
      const createSpecialtiesIds = specialties.filter(
        (specialty) => !specialty.isDeleted
      );
      for (const specialty of createSpecialtiesIds) {
        await tsx.doctorSpecialist.create({
          data: {
            doctorId: doctorInfo.id,
            specialitiesId: specialty.specialtiesId,
          },
        });
      }
      console.log(createSpecialtiesIds);
    }
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorInfo.id,
    },
    include: {
      DoctorSpecialist: {
        include: {
          Specialities: true,
        },
      },
    },
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deleteDoctor.email,
      },
    });

    return deleteDoctor;
  });
};

const softDelete = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deleteDoctor;
  });
};

export const DoctorService = {
  updateIntoDB,
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
  softDelete,
};
