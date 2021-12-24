import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";
import Course from "../models/Course";
import asyncHandler from "../middlewares/asyncHandler";
import Bootcamp from "../models/Bootcamp";

// @desc      Get all courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
export const getCourses = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc      Get a single courses
// @route     GET /api/v1/courses/:id
// @access    Public
export const getCourse = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    const error = new ErrorResponse({
      message: `Course not found with id: ${req.params.id}`,
      statusCode: 404,
    });
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Create a course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
export const createCourse = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.bootcamp = req.params.bootcampId;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    const error = new ErrorResponse({
      message: `Course not found with id: ${req.params.bootcampId}`,
      statusCode: 404,
    });
    return next(error);
  }

  const course = await Course.create(req.body);
  res.status(201).json({ success: true, data: course });
});
