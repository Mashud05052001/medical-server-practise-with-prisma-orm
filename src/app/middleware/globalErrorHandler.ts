import { ErrorRequestHandler } from "express";
import { TErrorSources, TObject } from "../interface/commonTypes";
import AppError from "../errors/AppError";
import path from "path";
import fs from "fs";
import clearUploadFolder from "../utils/clearUploadFolder";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500,
    message = "Something went wrong!!",
    errorSources: TErrorSources = [{ path: "", message: "" }];

  if (error instanceof AppError) {
    message = error?.message;
    statusCode = error?.statusCode;
  }

  clearUploadFolder();

  res.status(statusCode).send({
    success: false,
    message,
    errorSources,
    error,
  });
};

export default globalErrorHandler;
