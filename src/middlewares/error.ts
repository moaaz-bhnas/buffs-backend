import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";

export default function errorHandler(
  error: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let errorCopy = { ...error };
  errorCopy.message = error.message;

  // mongoose bad ObjectId
  if (error.name === "CastError") {
    const message = `resource not found with id: ${error.value}`;
    errorCopy = new ErrorResponse(message, 404);
  }

  console.log("errorCopy: ", errorCopy);

  res.status(errorCopy.statusCode || 500).json({
    success: false,
    error: errorCopy.message || "server error",
  });
}
