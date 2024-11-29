import { Specialities } from "@prisma/client";
import { TImageFile } from "../../interface/imageFileType";
import {
  cloudinaryUpload,
  deleteImageFromLocal,
} from "../../utils/imageUploader";
import { prisma } from "../../config";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const inserIntoDB = async (
  payload: Pick<Specialities, "title">,
  imageFile: TImageFile
) => {
  const isExist = await prisma.specialities.findFirst({
    where: { title: { equals: payload.title, mode: "insensitive" } },
  });
  if (isExist) {
    deleteImageFromLocal(imageFile);
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Speciality with this name already exists."
    );
  }
  const updatedData = {
    title: payload.title,
    icon: (await cloudinaryUpload(imageFile)) || "No Image",
  };

  const result = await prisma.specialities.create({
    data: updatedData,
  });

  return result;
};

const getAllFromDB = async () => {
  return await prisma.specialities.findMany();
};

const deleteFromDB = async (id: string) => {
  const result = await prisma.specialities.delete({
    where: { id },
  });
  return result;
};

export const SpecialitiesService = {
  inserIntoDB,
  getAllFromDB,
  deleteFromDB,
};
