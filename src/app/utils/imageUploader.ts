import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import multer from "multer";
import path from "path";
import { TImageFile } from "../interface/imageFileType";

cloudinary.config({
  cloud_name: "dcub9lrfu",
  api_key: "359181129217296",
  api_secret: "sV2-ARFLRRzWJjgixf-DpmTFkrg",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/upload"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const cloudinaryUpload = async (imageFile: TImageFile) => {
  const uploadResult = await cloudinary.uploader
    .upload(imageFile.path, {
      public_id: imageFile.originalname,
    })
    .catch((error) => {
      console.log(error);
    });
  fs.unlinkSync(imageFile.path);
  return uploadResult?.secure_url;
};

export const deleteImageFromLocal = (imageFile: TImageFile) => {
  fs.unlinkSync(imageFile.path);
};

export const multerImageUpload = multer({ storage: storage });
