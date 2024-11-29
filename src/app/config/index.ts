import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export const prisma = new PrismaClient();

export default {
  node_env: process.env.NODE_ENV,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
  access_token_secret_code: process.env.ACCESS_TOKEN_SECRET_CODE,
  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  refresh_token_secret_code: process.env.REFRESH_TOKEN_SECRET_CODE,
  reset_password_url: process.env.RESET_PASSWORD_URL,
};
