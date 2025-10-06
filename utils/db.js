import mongoose from "mongoose";
import { logger } from "./logger.js";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    logger.error(`Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};
