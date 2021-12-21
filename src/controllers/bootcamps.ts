import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";
import Bootcamp from "../models/Bootcamp";
import { asyncHandler } from "../middlewares/asyncHandler";
import geocoder from "../utils/geocoder";
import { Entry } from "node-geocoder";

interface QueryType {
  [key: string]: any;
}

type Query = {
  select: string;
};

function addDollarSign(query: QueryType): QueryType {
  let queryString = JSON.stringify(query);
  queryString = queryString.replace(
    /\b(lt|lte|gt|gte|in)\b/g,
    (match) => "$" + match
  );
  const newQuery = JSON.parse(queryString);
  return newQuery;
}

function removeReservedProps(query: QueryType): QueryType {
  const queryCopy = { ...query };
  const props = ["select"];
  props.forEach((prop) => delete queryCopy[prop]);
  return queryCopy;
}

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
export const getBootcamps = asyncHandler(async function (
  req: Request<{}, {}, {}, Query>,
  res: Response,
  next: NextFunction
) {
  let formattedQuery = removeReservedProps(req.query);
  formattedQuery = addDollarSign(formattedQuery);

  let selectedFields = "";
  if (req.query.select) {
    selectedFields = req.query.select.split(",").join(" ");
  }

  console.log("formattedQuery: ", formattedQuery);

  const bootcamps = await Bootcamp.find(formattedQuery, selectedFields);
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
