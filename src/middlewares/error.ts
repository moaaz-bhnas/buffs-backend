import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";

export default function errorHandler(
  error: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // console.log("error: ", error, "error.name: ", error.name);

  let errorCopy = { ...error };
  errorCopy.message = error.message;

  // mongoose bad ObjectId
  if (error.name === "CastError") {
    const message = `resource not found with id: ${error.value}`;
    errorCopy = new ErrorResponse({ message, statusCode: 404 });
  }

  // mongoose duplicate field
  if (error.code === 11000) {
    const { keyValue } = error;
    const key = Object.keys(keyValue)[0];
    const message = `duplicate field value is passed { ${key}: ${keyValue[key]} }`;
    errorCopy = new ErrorResponse({ message, statusCode: 400 });
  }

  res.status(errorCopy.statusCode || 500).json({
    success: false,
    error: errorCopy.message || "server error",
  });
}
