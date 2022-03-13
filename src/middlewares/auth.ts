import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "./asyncHandler";
import UserModel from "../models/User";

// Protect routes
export const protect = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // later ..
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(
      new ErrorResponse({
        message: "Not authorized to access this route",
        statusCode: 401,
      })
    );
  }

  // try {
  //   // verify token
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //   console.log("decoded: ", decoded);

  //   req.user = await UserModel.findById(decoded);
  // } catch (error) {
  //   console.error(error);
  // }
});
