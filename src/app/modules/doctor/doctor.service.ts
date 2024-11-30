import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { prisma } from "../../config";
import { TPaginationOptions } from "../../interface/pagination";
import { returnMetaData } from "../../utils/returnMetaData";
import { searchQueryBuilder } from "../../utils/searchQueryBuilder";
import { doctorSearchableFields } from "./doctor.constant";
import { TDoctorFilterRequest, TDoctorUpdate } from "./doctor.interface";

const getAllFromDB = async (
  filters: TDoctorFilterRequest,
  options: TPaginationOptions
) => {
  const { specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

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

  andConditions.push({
    isDeleted: false,
  });

  const query = searchQueryBuilder({
    filters: filterData,
    pagination: options,
    additionalConditions: andConditions,
    searchableFields: doctorSearchableFields,
  });

  const result = await prisma.doctor.findMany({
    where: query.where,
    skip: query.skip,
    take: query.limit,
    orderBy: query.orderBy,
    include: {
      DoctorSpecialist: {
        include: {
          Specialities: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: query.where,
  });

  return returnMetaData(total, query.page, query.limit, result);
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
