import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/errorResponse";
import Bootcamp from "../models/Bootcamp";
import asyncHandler from "../middlewares/asyncHandler";
import geocoder from "../utils/geocoder";
import { Entry } from "node-geocoder";

interface FormattedQuery {
  [key: string]: any;
  select: string;
}

interface Pagination {
  [key: string]: {
    page: number;
    limit: number;
  };
}

type Query = {
  select: string;
  sortBy: string;
  page: string;
  limit: string;
};

function addDollarSignToOperators(query: FormattedQuery): FormattedQuery {
  let queryString = JSON.stringify(query);
  queryString = queryString.replace(
    /\b(lt|lte|gt|gte|in)\b/g,
    (match) => "$" + match
  );
  const newQuery = JSON.parse(queryString);
  return newQuery;
}

function removeReservedParams(
  query: FormattedQuery,
  params: string[]
): FormattedQuery {
  const queryCopy = { ...query };
  params.forEach((param) => delete queryCopy[param]);
  return queryCopy;
}

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public: : any user can access
export const getBootcamps = asyncHandler(async function (
  req: Request<{}, {}, {}, Query>,
  res: Response,
  next: NextFunction
) {
  const reservedParams = ["select", "sortBy", "page", "limit"];
  let formattedQuery = removeReservedParams(req.query, reservedParams);
  formattedQuery = addDollarSignToOperators(formattedQuery);

  // projection
  const selectedFields = req.query.select
    ? req.query.select.split(",").join(" ")
    : "";

  // sorting
  const sortBy = req.query.sortBy || "_id";

  // pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  const bootcamps = await Bootcamp.find(formattedQuery)
    .select(selectedFields)
    .sort(sortBy)
    .skip(startIndex)
    .limit(limit)
    .populate("courses");

  // pagination: next / prev
  const pagination: Pagination = {};

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
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

  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    const error = new ErrorResponse({
      message: `Bootcamp not found with id: ${id}`,
      statusCode: 404,
    });
    next(error);
  }

  res.status(200).json({ success: true, data: bootcamp });
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

  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    const error = new ErrorResponse({
      message: `Bootcamp not found with id: ${id}`,
      statusCode: 404,
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
