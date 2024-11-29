import jwt, { JwtPayload } from "jsonwebtoken";
import { TObject } from "../interface/commonTypes";
import config from "../config";

const createAccessToken = (payload: TObject) => {
  return jwt.sign(payload, config.access_token_secret_code as string, {
    expiresIn: config.access_token_expires_in,
    algorithm: "HS256",
  });
};
const customExpiresInAccessToken = (payload: TObject, expiresIn: string) => {
  return jwt.sign(payload, config.access_token_secret_code as string, {
    expiresIn,
    algorithm: "HS256",
  });
};
const createRefreshToken = (payload: TObject) => {
  return jwt.sign(payload, config.refresh_token_secret_code as string, {
    expiresIn: config.refresh_token_expires_in,
    algorithm: "HS256",
  });
};

const varifyAccessToken = (token: string) => {
  return jwt.verify(
    token,
    config.access_token_secret_code as string
  ) as JwtPayload;
};

const varifyRefreshToken = (token: string) => {
  return jwt.verify(
    token,
    config.refresh_token_secret_code as string
  ) as JwtPayload;
};
const decodeToken = (token: string) => jwt.decode(token) as JwtPayload;

export const jwtHelpers = {
  decodeToken,
  createAccessToken,
  varifyAccessToken,
  createRefreshToken,
  varifyRefreshToken,
  customExpiresInAccessToken,
};
