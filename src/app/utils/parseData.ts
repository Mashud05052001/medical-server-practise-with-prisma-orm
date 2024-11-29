import { RequestHandler } from "express";

const parseData: RequestHandler = (req, res, next) => {
  req.body = JSON.parse(req.body?.data);
  next();
};

export default parseData;
