import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import UserModel from "../models/User";

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

  res.status(201).json({
    success: true,
  });
});
