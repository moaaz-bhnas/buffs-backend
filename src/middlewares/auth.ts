import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "./asyncHandler";
import UserModel from "../models/User";

interface JwtPayload {
  id: string;
}

// Protect routes
// Makes sure it's a logged-in user
export const protect = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") // formatted correctly check
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // later ..
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    const error = new ErrorResponse({
      message: "Not authorized to access this route",
      statusCode: 401,
    });
    return next(error);
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");

    console.log("decoded: ", decoded);

    // logged-in user
    const { id } = decoded as JwtPayload;
    req.user = await UserModel.findById(id);

    next();
  } catch (error) {
    console.error(error);
  }
});
