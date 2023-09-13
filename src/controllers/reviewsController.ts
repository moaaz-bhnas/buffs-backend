import { CreateReviewRequestBody } from "@/interfaces/reviews/CreateReviewRequestBody";
import { RegisteringReview } from "@/interfaces/reviews/RegisteringReview";
import { HttpStatusCode } from "@/interfaces/http-status-codes/HttpStatusCode";
import ReviewModel from "@/schemas/ReviewSchema";
import ErrorResponse from "@/utils/errorResponse";
import { NextFunction, Request, Response } from "express";
import UserModel from "@/schemas/UserSchema";
import mongoose from "mongoose";

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
        username: req.user.username,
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

  /**
   * @desc      Edits a review in the database
   * @route     PUT /api/v1/reviews/:reviewId
   * @access    Private: only authenticated users
   */
  async updateReview(req: Request, res: Response, next: NextFunction) {
    // 1. check token validation
    if (!req.user) {
      const error = new ErrorResponse({
        message: `User is not authorized to access this route.`,
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
      return next(error);
    }

    // 2. check whether the review exists
    const review = await ReviewModel.findById(req.params.reviewId);
    if (!review) {
      const error = new ErrorResponse({
        message: `Review with ID: ${req.params.reviewId} doesn't exist.`,
        statusCode: HttpStatusCode.NOT_FOUND,
      });
      return next(error);
    }

    // 3. check whether the user is the author
    const isAuthor = review.userId.equals(req.user._id);
    if (!isAuthor) {
      const error = new ErrorResponse({
        message: `User with ID: ${req.user._id} in not the author of the the review with ID: ${req.params.reviewId}.`,
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
      return next(error);
    }

    try {
      const review = await ReviewModel.findByIdAndUpdate(
        req.params.reviewId,
        req.body,
        { returnDocument: "after" }
      );
      res.status(HttpStatusCode.OK).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Flags a review as deleted (soft deletion)
   * @route     DELETE /api/v1/reviews/:reviewId
   * @access    Private: only authenticated users
   */
  async deleteReview(req: Request, res: Response, next: NextFunction) {
    // 1. check token validation
    if (!req.user) {
      const error = new ErrorResponse({
        message: `User is not authorized to access this route.`,
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
      return next(error);
    }

    // 2. check whether the review exists
    const review = await ReviewModel.findById(req.params.reviewId);
    if (!review) {
      const error = new ErrorResponse({
        message: `Review with ID: ${req.params.reviewId} doesn't exist.`,
        statusCode: HttpStatusCode.NOT_FOUND,
      });
      return next(error);
    }

    // 3. check whether the user is the author
    const isAuthor = review.userId.equals(req.user._id);
    if (!isAuthor) {
      const error = new ErrorResponse({
        message: `User with ID: ${req.user._id} in not the author of the the review with ID: ${req.params.reviewId}.`,
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
      return next(error);
    }

    try {
      const review = await ReviewModel.findByIdAndUpdate(
        req.params.reviewId,
        { $set: { isDeleted: true } },
        { returnDocument: "after" }
      );
      res.status(HttpStatusCode.OK).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Likes a review
   * @route     PUT /api/v1/reviews/:reviewId/like
   * @access    Private: only authenticated users
   */
  async likeReview(req: Request, res: Response, next: NextFunction) {
    // 1. check token validation
    if (!req.user) {
      const error = new ErrorResponse({
        message: `User is not authorized to access this route.`,
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
      return next(error);
    }

    // 2. check whether user already liked this review
    const isLiked = req.user.likes.some((likedReview) =>
      likedReview.equals(req.params.reviewId)
    );
    if (isLiked) {
      const error = new ErrorResponse({
        message: `User with ID: ${req.user._id} already likes review with ID: ${req.params.reviewId}.`,
        statusCode: HttpStatusCode.CONFLICT,
      });
      return next(error);
    }

    // 3. update user likes / review likers
    const session = await mongoose.startSession();
    try {
      // Start transaction
      session.startTransaction();

      await UserModel.findByIdAndUpdate(req.user._id, {
        $addToSet: { likes: req.params.reviewId },
      });
      const updatedReview = await ReviewModel.findByIdAndUpdate(
        req.params.reviewId,
        { $addToSet: { likers: req.user._id } },
        { returnDocument: "after" }
      );

      // finish transcation
      await session.commitTransaction();
      session.endSession();

      res
        .status(HttpStatusCode.OK)
        .json({ success: true, data: updatedReview });
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }

  /**
   * @desc      Unlikes a review
   * @route     PUT /api/v1/reviews/:reviewId/unlike
   * @access    Private: only authenticated users
   */
  async unlikeReview(req: Request, res: Response, next: NextFunction) {
    // 1. check token validation
    if (!req.user) {
      const error = new ErrorResponse({
        message: `User is not authorized to access this route.`,
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
      return next(error);
    }

    // 2. check whether user already liked this review
    const isLiked = req.user.likes.some((likedReview) =>
      likedReview.equals(req.params.reviewId)
    );
    if (!isLiked) {
      const error = new ErrorResponse({
        message: `Review with ID: ${req.params.reviewId} in not user ID: ${req.user._id} list of likes.`,
        statusCode: HttpStatusCode.CONFLICT,
      });
      return next(error);
    }

    // 3. update user likes / review likers
    const session = await mongoose.startSession();
    try {
      // Start transaction
      session.startTransaction();

      await UserModel.findByIdAndUpdate(req.user._id, {
        $pull: { likes: req.params.reviewId },
      });
      const updatedReview = await ReviewModel.findByIdAndUpdate(
        req.params.reviewId,
        { $pull: { likers: req.user._id } },
        { returnDocument: "after" }
      );

      // finish transcation
      await session.commitTransaction();
      session.endSession();

      res
        .status(HttpStatusCode.OK)
        .json({ success: true, data: updatedReview });
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      next(error);
    }
  }
}

const reviewsController = new ReviewsController();

export default reviewsController;
