import { NextFunction, Request, Response } from "express";
import path from "path";
import ErrorResponse from "../utils/errorResponse";
import Bootcamp from "../models/Bootcamp";
import asyncHandler from "../middlewares/asyncHandler";
import geocoder from "../utils/geocoder";
import { Entry } from "node-geocoder";

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public: : any user can access
export const getBootcamps = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(200).json(res.advancedResults);
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
  if (!bootcamp) {
    const error = new ErrorResponse({
      message: `Bootcamp not found with id: ${id}`,
      statusCode: 404,
    });
    return next(error);
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Create a bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private: Only specific users
export const createBootcamp = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  // If user is not admin, and already published a bootcamp, then abort
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
  if (req.user.role !== "admin" && publishedBootcamp) {
    const error = new ErrorResponse({
      statusCode: 400,
      message: `User with ID: ${req.user.id} has already published a bootcamp`,
    });
    return next(error);
  }

  // Add user to body
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

// @desc      Update a bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
export const updateBootcamp = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    const error = new ErrorResponse({
      message: `Bootcamp not found with id: ${id}`,
      statusCode: 404,
    });
    next(error);
  }

  if (bootcamp?.user.toString() !== req.user.id && req.user.role !== "admin") {
    const error = new ErrorResponse({
      message: `User: ${req.user.id} is not authorized to update this bootcamp`,
      statusCode: 401,
    });
    return next(error);
  }

  const updatedBootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: updatedBootcamp });
});

// @desc      Delete a bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
export const deleteBootcamp = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    const error = new ErrorResponse({
      message: `Bootcamp not found with id: ${id}`,
      statusCode: 404,
    });
    return next(error);
  }

  if (bootcamp?.user.toString() !== req.user.id && req.user.role !== "admin") {
    const error = new ErrorResponse({
      message: `User: ${req.user.id} is not authorized to delete this bootcamp`,
      statusCode: 401,
    });
    return next(error);
  }

  await bootcamp.deleteOne();
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Public
export const getBootcampsInRadius = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { zipcode, distance } = req.params;

  const location: Entry[] = await geocoder.geocode(zipcode);
  const { longitude, latitude } = location[0];

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], distance] },
    },
  });

  console.log("getBootcampsInRadius - bootcamps: ", bootcamps.length);

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc      Upload photo for bootcamp
// @route     PUT /api/v1/bootcamps/:id/photo
// @access    Private
export const uploadBootcampPhoto = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    const error = new ErrorResponse({
      message: `Bootcamp not found with id: ${id}`,
      statusCode: 404,
    });
    return next(error);
  }

  if (bootcamp?.user.toString() !== req.user.id && req.user.role !== "admin") {
    const error = new ErrorResponse({
      message: `User: ${req.user.id} is not authorized to delete this bootcamp`,
      statusCode: 401,
    });
    return next(error);
  }

  const { file } = req;
  console.log("file: ", file);
  if (!file) {
    const error = new ErrorResponse({
      message: `Please upload a file`,
      statusCode: 400,
    });
    return next(error);
  }

  if (!file.mimetype.startsWith("image")) {
    const error = new ErrorResponse({
      message: `Please upload an image file`,
      statusCode: 400,
    });
    return next(error);
  }

  if (file.size > Number(process.env.MAX_FILE_UPLOAD)) {
    const error = new ErrorResponse({
      message: `Please upload an image less than ${
        Number(process.env.MAX_FILE_UPLOAD) / 1000000
      } mb`,
      statusCode: 400,
    });
    return next(error);
  }

  file.filename = `${file.fieldname}${path.parse(file.originalname).ext}`;

  await Bootcamp.findByIdAndUpdate(id, { photo: file.filename });

  res.status(200).json({
    success: true,
    data: file.filename,
  });
});
