import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import asyncHandler from "../middlewares/asyncHandler";
import UserModel, { InstanceMethods, IUser } from "../models/User";
import ErrorResponse from "../utils/errorResponse";

// @desc      Register user
// @route     POST /api/v1/auth/register
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
// @route     POST /api/v1/auth/login
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

  sendTokenResponse(user, 200, res);
});

// @desc      Log user out
// @route     GET /api/v1/auth/logout
// @access    Public
export const logout = asyncHandler(function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true, // because we want the cookie to only be accessed through the client-side
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get logged-in user
// @route     GET /api/v1/auth/me
// @access    Private
export const getMe = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("user: ", req.user);

  res.status(200).json({
    success: true,
    data: req.user,
  });
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
export const forgotPassword = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    const error = new ErrorResponse({
      message: "There is no user with that email",
      statusCode: 404,
    });
    return next(error);
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  console.log("resetToken: ", resetToken);

  user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Using a cookie is safer than storing the token in the local storage
// Get token from model, create cookie and send response
function sendTokenResponse(
  user: Document<{}, {}, IUser> & InstanceMethods,
  statusCode: number,
  res: Response
) {
  // Create token
  const token = user.getSignedJwtToken();

  const JWT_COOKIE_EXPIRE = Number(process.env.JWT_COOKIE_EXPIRE) ?? 30;

  const options: any = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true, // because we want the cookie to only be accessed through the client-side
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
}
