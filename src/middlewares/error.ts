import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";

export default function errorHandler(
  error: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // console.log("error: ", error, "error.name: ", error.name);

  let errorResponse = { ...error };
  errorResponse.message = error.message;

  // mongoose bad ObjectId
  if (error.name === "CastError") {
    const message = `resource not found with id: ${error.value}`;
    errorResponse = new ErrorResponse({ message, statusCode: 404 });
  }

  // mongoose missing required field
  if (error.name === "ValidationError") {
    const field = error.message.split(":")[1].trim();
    const message = `required field is missing: ${field}`;
    errorResponse = new ErrorResponse({ message, statusCode: 400 });
  }

  // mongoose duplicate field
  if (error.code === 11000) {
    const { keyValue } = error;
    const key = Object.keys(keyValue)[0];
    const message = `duplicate field value is passed: { ${key}: ${keyValue[key]} }`;
    errorResponse = new ErrorResponse({ message, statusCode: 400 });
  }

  res.status(errorResponse.statusCode || 500).json({
    success: false,
    error: errorResponse.message || "server error",
  });
}
