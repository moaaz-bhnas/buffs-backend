import { NextFunction, Request, Response } from "express";
import { Document, Model } from "mongoose";
import asyncHandler from "../middlewares/asyncHandler";
import UserModel, { InstanceMethods, IUser } from "../models/User";
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

  sendTokenResponse(user, 200, res);
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
    httpOnly: true, // because we want the cookie to pnly be accessed through the client-side
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
}

// @desc      Login user
// @route     Post /api/v1/auth/login
// @access    Public: any user can access
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
