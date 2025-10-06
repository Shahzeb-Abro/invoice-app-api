import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { logger } from "../utils/logger.js";
import Account from "./auth.model.js";
import jwt from "jsonwebtoken";

const signTokenAndSetCookie = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);
  return token;
};

// @route POST /api/v1/auth/register
// @desc Register a new user
// @access Public
export const registerUser = catchAsync(async (req, res, next) => {
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

  const token = signTokenAndSetCookie(newAccount._id, res);

  return res.status(201).json({
    token,
    data: {
      account: {
        id: newAccount._id,
        firstName: newAccount.firstName,
        lastName: newAccount.lastName,
        email: newAccount.email,
        createdAt: newAccount.createdAt,
        updatedAt: newAccount.updatedAt,
      },
    },
  });
});

// @route POST /api/v1/auth/login
// @desc Login user
// @access Public
export const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const account = await Account.findOne({ email }).select("+password");
  if (
    !account ||
    !(await account.correctPassword(password, account.password))
  ) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signTokenAndSetCookie(account._id, res);
  return res.status(200).json({
    token,
    data: {
      account: {
        id: account._id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
    },
  });
});
