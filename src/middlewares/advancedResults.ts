import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";

type Query = {
  select: string;
  sort: string;
  page: string;
  limit: string;
};

interface FormattedQuery {
  [key: string]: any;
  select: string;
}

export interface Pagination {
  [key: string]: {
    page: number;
    limit: number;
  };
}

function removeReservedParams(query: FormattedQuery): FormattedQuery {
  // Fields to exclude
  const reservedParams = ["select", "sort", "page", "limit"];
  const queryCopy = { ...query };
  reservedParams.forEach((param) => delete queryCopy[param]);
  return queryCopy;
}

function addDollarSignToOperators(query: FormattedQuery): FormattedQuery {
  let queryString = JSON.stringify(query);
  queryString = queryString.replace(
    /\b(lt|lte|gt|gte|in)\b/g,
    (match) => "$" + match
  );
  const newQuery = JSON.parse(queryString);
  return newQuery;
}

export default function (model: Model<any>) {
  return async function advancedResults(
    req: Request<{}, {}, {}, Query>,
    res: Response,
    next: NextFunction
  ) {
    // remove reserved words from query
    let formattedQuery = removeReservedParams(req.query);

    // create operators (e.g. $lt, $gt)
    formattedQuery = addDollarSignToOperators(formattedQuery);

    // build query
    let query = model.find(formattedQuery);

    // projection
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields); // e.g. .select(name, description)
    }

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy); // e.g. .sort(-name)
    }

    // pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // executing query
    // const results = await query;

    let results = [];
    try {
      results = await query;
    } catch (error) {
      next(error);
    }

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

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };

    next();
  };
}
