import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import UserModel from "../models/User";
import ErrorResponse from "../utils/errorResponse";

// @desc      Register user
// @route     Post /api/v1/auth/register
// @access    Public: any user can access
export const register = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password, role } = req.body;

  const user = await UserModel.create({ name, email, password, role });

  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    token,
  });
});

// @desc      Login user
// @route     Post /api/v1/auth/login
// @access    Public: any user can access
export const login = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;

  // Verify email and password
  if (!email || !password) {
    const error = new ErrorResponse({
      message: "Please provide an email and password",
      statusCode: 400,
    });
    return next(error);
  }

  // Check email
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    const error = new ErrorResponse({
      message: "Invalid credentials",
      statusCode: 401,
    });
    return next(error);
  }

  // Check password
  const passwordIsMatch = await user.matchPassword(password);

  if (!passwordIsMatch) {
    const error = new ErrorResponse({
      message: "Invalid credentials",
      statusCode: 401,
    });
    return next(error);
  }

  // Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
  });
});
