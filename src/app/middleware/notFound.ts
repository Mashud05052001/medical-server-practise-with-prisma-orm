import { Request, RequestHandler, Response } from "express";
import { SendResponse } from "../utils/sendResponse";

const notFound: RequestHandler = (_req, res) => {
  SendResponse(res, {
    statusCode: 404,
    success: false,
    message: "API not found!",
    data: null,
  });
};

export default notFound;
