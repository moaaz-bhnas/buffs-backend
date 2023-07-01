import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";
import asyncHandler from "../utils/asyncHandler";
import UserModel from "../models/UserModel";

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
  } else if (req.cookies.token) {
    token = req.cookies.token;
    /*
    Now even if the token isn't sent with the request, it'll be the cookie
    and request is still gonna work
    */
  }

  console.log("token: ", typeof token);

  // Make sure token exists
  if (!token || token === "null" || token === "none") {
    console.log("ErrorResponse");
    const error = new ErrorResponse({
      message: "Not authorized to access this route",
      statusCode: 401,
    });
    return next(error);
  }

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");

    // logged-in user
    const { id } = decoded as JwtPayload;
    req.user = await UserModel.findById(id);

    return next();
  } catch (error) {
    return next(error);
  }
});

export function authorize(...roles: string[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (req.user && !roles.includes(req.user.role)) {
      const error = new ErrorResponse({
        message: `User role "${req.user.role}" not authorized to access this route`,
        statusCode: 403,
      });
      return next(error);
    }
    next();
  };
}
