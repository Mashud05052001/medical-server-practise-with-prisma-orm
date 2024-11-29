import bcrypt from "bcrypt";
import config from "../config";

const createHashedCode = async (planeText: string) => {
  const salt_rounds = Number(config.bcrypt_salt_rounds);
  const hashedCode = await bcrypt.hash(planeText, salt_rounds);
  return hashedCode;
};

const compareHashedCode = async (planeText: string, hashedText: string) => {
  return await bcrypt.compare(planeText, hashedText);
};

export const bcryptHelpers = {
  createHashedCode,
  compareHashedCode,
};
