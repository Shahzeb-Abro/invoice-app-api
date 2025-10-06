import express from "express";
import dotenv from "dotenv";
import { logger } from "./utils/logger.js";
dotenv.config();

import morgan from "morgan";
import "colors";
import qs from "qs";
import cookieParser from "cookie-parser";

import authRoutes from "./auth/auth.routes.js";
import invoiceRoutes from "./invoice/invoice.routes.js";
import { connectDB } from "./utils/db.js";
import globalErrorHandler from "./error/error.controller.js";
import AppError from "./utils/appError.js";

const app = express();
app.set("query parser", (str) => qs.parse(str, { allowDots: true }));
connectDB();

app.use(
  morgan("dev", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res, next) => {
  return next(new AppError("This route is not defined", 404));
  res.status(200).send("Hello, World!");
});

app.use(globalErrorHandler);

app.listen(process.env.PORT, () => {
  logger.info(`Server is running on port ${process.env.PORT}`);
});
