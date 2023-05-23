// import { NextFunction, Request, Response } from "express";
// import ErrorResponse from "../utils/errorResponse";
// import Course from "../models/Course";
// import asyncHandler from "../middlewares/asyncHandler";
// import Bootcamp from "../models/Bootcamp";

// // @desc      Get all courses
// // @route     GET /api/v1/courses
// // @route     GET /api/v1/bootcamps/:bootcampId/courses
// // @access    Public
// export const getCourses = asyncHandler(async function (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   if (req.params.bootcampId) {
//     const courses = await Course.find({ bootcamp: req.params.bootcampId });
//     res.status(200).json({
//       success: true,
//       count: courses.length,
//       data: courses,
//     });
//   } else {
//     res.status(200).json(res.advancedResults);
//   }
// });

// // @desc      Get a single courses
// // @route     GET /api/v1/courses/:id
// // @access    Public
// export const getCourse = asyncHandler(async function (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const course = await Course.findById(req.params.id).populate({
//     path: "bootcamp",
//     select: "name description",
//   });

//   if (!course) {
//     const error = new ErrorResponse({
//       message: `Course not found with id: ${req.params.id}`,
//       statusCode: 404,
//     });
//     return next(error);
//   }

//   res.status(200).json({
//     success: true,
//     data: course,
//   });
// });

// // @desc      Create a course
// // @route     POST /api/v1/bootcamps/:bootcampId/courses
// // @access    Private
// export const createCourse = asyncHandler(async function (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   req.body.bootcamp = req.params.bootcampId;

//   const bootcamp = await Bootcamp.findById(req.params.bootcampId);

//   // Does the bootcamp even exist?
//   if (!bootcamp) {
//     const error = new ErrorResponse({
//       message: `Bootcamp not found with id: ${req.params.bootcampId}`,
//       statusCode: 404,
//     });
//     return next(error);
//   }

//   // Are you the bootcamp owner?
//   if (bootcamp?.user.toString() !== req.user.id && req.user.role !== "admin") {
//     const error = new ErrorResponse({
//       message: `User: ${req.user.id} is not authorized to add course to bootcamp: ${req.body.bootcamp}`,
//       statusCode: 401,
//     });
//     return next(error);
//   }

//   // Add user to body
//   req.body.user = req.user.id;
//   const course = await Course.create(req.body);
//   res.status(201).json({ success: true, data: course });
// });

// // @desc      Update a course
// // @route     PUT /api/v1/courses/:id
// // @access    Private
// export const updateCourse = asyncHandler(async function (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { id } = req.params;

//   const course = await Course.findById(id);

//   if (!course) {
//     const error = new ErrorResponse({
//       message: `Course not found with id: ${id}`,
//       statusCode: 404,
//     });
//     return next(error);
//   }

//   // Are you the course owner?
//   if (course?.user.toString() !== req.user.id && req.user.role !== "admin") {
//     const error = new ErrorResponse({
//       message: `User: ${req.user.id} is not authorized to update course: ${course._id}`,
//       statusCode: 401,
//     });
//     return next(error);
//   }

//   const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   res.status(200).json({ success: true, data: updatedCourse });
// });

// // @desc      Delete a course
// // @route     DELETE /api/v1/courses/:id
// // @access    Private
// export const deleteCourse = asyncHandler(async function (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { id } = req.params;

//   const course = await Course.findById(id);

//   if (!course) {
//     const error = new ErrorResponse({
//       message: `Course not found with id: ${id}`,
//       statusCode: 404,
//     });
//     return next(error);
//   }

//   // Are you the course owner?
//   if (course?.user.toString() !== req.user.id && req.user.role !== "admin") {
//     const error = new ErrorResponse({
//       message: `User: ${req.user.id} is not authorized to delete course: ${course._id}`,
//       statusCode: 401,
//     });
//     return next(error);
//   }

//   await course.deleteOne();
//   res.status(200).json({ success: true, data: course });
// });
