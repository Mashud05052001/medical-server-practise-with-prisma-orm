import { Response } from "express";
import { TObject } from "../interface/commonTypes";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T | null | undefined;
  meta?: {
    page: number;
    total: number;
    limit: number;
  };
};

export const SendResponse = <T>(res: Response, data: TResponse<T>) => {
  const sendData = {
    success: data?.success,
    message: data?.message || "Done successfully",
    meta: data?.meta || null || undefined,
    data: data?.data || null || undefined,
  };
  return res.status(data.statusCode).send(sendData);
};
