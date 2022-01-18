import { NextFunction, Request, Response } from "express";
import upload from "../multer";

export default function multerUpload(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  return upload.single(`bootcamp-${id}`)(req, res, next);
}
