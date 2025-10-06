import AppError from "../utils/appError.js";
import { logger } from "../utils/logger.js";
import Account from "./auth.model.js";

// @route POST /api/v1/auth/register
// @desc Register a new user
// @access Public
export const registerUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  console.log("Email", email);
  const existingAccount = await Account.findOne({ email: email });

  if (existingAccount) {
    return next(new AppError("Email already in use", 400));
  }

  const newAccount = new Account({
    firstName,
    lastName,
    email,
    password,
  });
  await newAccount.save();
  logger.info("New account created for email: " + email);
  return res.status(200).json({ message: "User registered successfully" });
};
