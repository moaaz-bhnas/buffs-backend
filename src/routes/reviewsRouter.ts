import { NextFunction, Request, Response, Router } from "express";
import advancedResults from "@/middlewares/advancedResults";
import { protect } from "@/middlewares/protect";
import ReviewModel from "@/schemas/ReviewSchema";
import { CreateReviewRequestBody } from "@/interfaces/reviews/CreateReviewRequestBody";
import ErrorResponse from "@/utils/errorResponse";
import { RegisteringReview } from "@/interfaces/reviews/RegisteringReview";
import HttpStatusCode from "@/interfaces/http-status-codes/HttpStatusCode";

export default class ReviewsRouter {
  // todo: set logger

  static init(router: Router): Router {
    router.get("/", advancedResults(ReviewModel), this.getReviews);
    router.post("/", protect, this.createReview);
    router.put("/:reviewId", protect, this.updateReview);
    router.delete("/:reviewId", protect, this.deleteReview);
    router.put("/:reviewId", protect, this.likeReview);

    return router;
  }

  /**
   * @desc      Gets all users
   * @route     GET /api/v1/users
   * @access    Public
   */
  private static async getReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return res.status(200).json(res.advancedResults);
  }

  /**
   * @desc      Creates a review in the database
   * @route     POST /api/v1/reviews
   * @access    Private: only authenticated users
   */
  private static async createReview(
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
  private static async updateReview(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
  private static async deleteReview(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
  private static async likeReview(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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

    // 3. check whether user already liked this review
    const isLiked = review.likers.some(
      (liker) => req.user && liker.equals(req.user?._id)
    );
    try {
      const updatedReview = await ReviewModel.findByIdAndUpdate(
        req.params.reviewId,
        isLiked
          ? { $pull: { likers: req.user._id } }
          : { $addToSet: { likers: req.user._id } },
        { returnDocument: "after" }
      );
      res
        .status(HttpStatusCode.OK)
        .json({ success: true, data: updatedReview });
    } catch (error) {
      next(error);
    }
  }
}
