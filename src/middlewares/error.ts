import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";

export default function errorHandler(
  error: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error.stack?.red);

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "server error",
  });
}
