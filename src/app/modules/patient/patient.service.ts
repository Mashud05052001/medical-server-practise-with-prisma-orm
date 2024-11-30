import { Patient, Prisma, UserStatus } from "@prisma/client";

import { TPatientFilterRequest, TPatientUpdate } from "./patient.interface";
import { TPaginationOptions } from "../../interface/pagination";
import { calculatePagination } from "../../helpers/paginationHelpers";
import { patientSearchableFields } from "./patient.constant";
import { prisma } from "../../config";
import { searchQueryBuilder } from "../../utils/searchQueryBuilder";
import { returnMetaData } from "../../utils/returnMetaData";

const getAllFromDB = async (
  filters: TPatientFilterRequest,
  options: TPaginationOptions
) => {
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.PatientWhereInput[] = [];

  andConditions.push({ isDeleted: false });

  const query = searchQueryBuilder({
    filters: filters,
    pagination: options,
    additionalConditions: andConditions,
    searchableFields: patientSearchableFields,
  });

  const result = await prisma.patient.findMany({
    where: query.where,
    skip: query.skip,
    take: query.limit,
    orderBy: query.orderBy,
    include: {
      MedicalReport: true,
      PatientHealthCare: true,
    },
  });
  const total = await prisma.patient.count({
    where: query.where,
  });

  return returnMetaData(total, query.page, query.limit, result);
};

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      MedicalReport: true,
      PatientHealthCare: true,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: TPatientUpdate
): Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...othersPatientData } = payload;

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.$transaction(async (tsx) => {
    //update patient data
    await tsx.patient.update({
      where: {
        id,
      },
      data: othersPatientData,
    });

    // create or update patient health data
    if (patientHealthData) {
      await tsx.patientHealthCare.upsert({
        where: { patientId: patientInfo.id },
        update: patientHealthData,
        create: { ...patientHealthData, patientId: patientInfo.id },
      });
    }
    // create medical report
    if (medicalReport) {
      await tsx.medicalReport.create({
        data: { ...medicalReport, patientId: patientInfo.id },
      });
    }
  });

  const responseData = await prisma.patient.findUnique({
    where: {
      id: patientInfo.id,
    },
    include: {
      MedicalReport: true,
      PatientHealthCare: true,
    },
  });
  return responseData;
};

const deleteFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.$transaction(async (tsx) => {
    // delete medical report
    await tsx.medicalReport.deleteMany({
      where: {
        patientId: id,
      },
    });

    // delete patient health data
    await tsx.patientHealthCare.delete({
      where: {
        patientId: id,
      },
    });

    const deletedPatient = await tsx.patient.delete({
      where: {
        id,
      },
    });

    await tsx.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });

    return deletedPatient;
  });

  return result;
};

const softDelete = async (id: string): Promise<Patient | null> => {
  return await prisma.$transaction(async (tsx) => {
    const deletedPatient = await tsx.patient.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await tsx.user.update({
      where: {
        email: deletedPatient.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deletedPatient;
  });
};

export const PatientService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};
