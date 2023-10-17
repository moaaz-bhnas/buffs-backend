import { Query } from "@/interfaces/express/Query";
import getMongoDBFormattedQuery from "@/utils/getMongoDBFormattedQuery";
import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";

export interface Pagination {
  [key: string]: {
    page: number;
    limit: number;
  };
}

export default function (model: Model<any>) {
  return async function advancedResults(
    req: Request<{}, {}, {}, Query>,
    res: Response,
    next: NextFunction
  ) {
    const formattedQuery = getMongoDBFormattedQuery(req.query);

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
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 25;
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
