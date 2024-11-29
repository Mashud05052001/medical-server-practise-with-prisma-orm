import { AnyZodObject } from "zod";
import { catchAsync } from "../utils/catchAsync";

const validateRequest = (schema: AnyZodObject) =>
  catchAsync(async (req, res, next) => {
    const data = { body: req?.body };
    const parsedData = await schema.parseAsync(data);
    req.body = parsedData?.body;
    next();
  });

export const validateRequestCookies = (schema: AnyZodObject) =>
  catchAsync(async (req, res, next) => {
    const cookies = { cookies: req.cookies };
    const parsedCookies = await schema.parseAsync(cookies);
    req.cookies = parsedCookies.cookies;
    next();
  });

export default validateRequest;
