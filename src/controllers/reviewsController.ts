import { CreateReviewRequestBody } from "@/interfaces/reviews/CreateReviewRequestBody";
import { RegisteringReview } from "@/interfaces/reviews/RegisteringReview";
import { HttpStatusCode } from "@/interfaces/http-status-codes/HttpStatusCode";
import ReviewModel from "@/schemas/ReviewSchema";
import ErrorResponse from "@/utils/errorResponse";
import { NextFunction, Request, Response } from "express";

class ReviewsController {
  // todo: set logger

  /**
   * @desc      Gets all users
   * @route     GET /api/v1/users
   * @access    Public
   */
  async getReviews(req: Request, res: Response, next: NextFunction) {
    return res.status(200).json(res.advancedResults);
  }

  /**
   * @desc      Creates a review in the database
   * @route     POST /api/v1/reviews
   * @access    Private: only authenticated users
   */
  async createReview(
    req: Request<{}, {}, CreateReviewRequestBody>,
    res: Response,
    next: NextFunction
  ) {
    if (!req.user) {
      const error = new ErrorResponse({
        message: `User is not authorized to access this route.`,
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
      return next(error);
    }

    // 1. Collect review data
    const reveiwData: RegisteringReview = {
      ...req.body,
      userId: req.user._id,
      userDetails: {
        displayName: req.user.displayName,
        avatar: req.user.avatar,
      },
    };

    try {
      // 2. Add the review to database
      const review = await ReviewModel.create(reveiwData);
      res.status(HttpStatusCode.CREATED).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  }
}

const reviewsController = new ReviewsController();

export default reviewsController;
