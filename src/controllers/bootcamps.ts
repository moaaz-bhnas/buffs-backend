import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";
import Bootcamp from "../models/Bootcamp";

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
export async function getBootcamps(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, data: bootcamps });
  } catch (error) {
    next(error);
  }
}

// @desc      Get a single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
export async function getBootcamp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  try {
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
  } catch (error) {
    next(error);
  }
}

// @desc      Create a bootcamp
// @route     POST /api/v1/bootcamps
// @access    Public
export async function createBootcamp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
}

// @desc      Update a bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Public
export async function updateBootcamp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  try {
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
  } catch (error) {
    next(error);
  }
}

// @desc      Delete a bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Public
export async function deleteBootcamp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
}
