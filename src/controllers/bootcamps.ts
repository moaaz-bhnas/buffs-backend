import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";
import Bootcamp from "../models/Bootcamp";
import { asyncHandler } from "../middlewares/asyncHandler";

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
export const getBootcamps = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc      Get a single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
export const getBootcamp = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findById(id);
  if (bootcamp) {
    res.status(200).json({ success: true, data: bootcamp });
  } else {
    const error = new ErrorResponse({
      message: `Bootcamp not found with id: ${id}`,
      statusCode: 404,
    });
    next(error);
  }
});

// @desc      Create a bootcamp
// @route     POST /api/v1/bootcamps
// @access    Public
export const createBootcamp = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc      Update a bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Public
export const updateBootcamp = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (bootcamp) {
    res.status(200).json({ success: true, data: bootcamp });
  } else {
    const error = new ErrorResponse({
      message: `Bootcamp not found with id: ${id}`,
      statusCode: 404,
    });
    next(error);
  }
});

// @desc      Delete a bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Public
export const deleteBootcamp = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (bootcamp) {
    res.status(200).json({ success: true, data: bootcamp });
  } else {
    const error = new ErrorResponse({
      message: `Bootcamp not found with id: ${id}`,
      statusCode: 404,
    });
    next(error);
  }
});
