import express, { Application, Request, Response } from "express";
import cors from "cors";
import { AllRoutes } from "./app/routes";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";

export const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    success: true,
    message: "🔥 Medical Server API 🔥",
  });
});

app.use("/api/v1", AllRoutes);

app.use(globalErrorHandler);
app.use(notFound);
