import { IComment, RegisteringComment } from "@/interfaces/comments/IComment";
import HttpStatusCode from "@/interfaces/http-status-codes/HttpStatusCode";
import advancedResults from "@/middlewares/advancedResults";
import { protect } from "@/middlewares/protect";
import CommentModel from "@/schemas/CommentSchema";
import ReviewModel from "@/schemas/ReviewSchema";
import ErrorResponse from "@/utils/errorResponse";
import { NextFunction, Request, Response, Router } from "express";

export default class CommentsRouter {
  // todo: set logger

  static init(router: Router): Router {
    router.get("/", advancedResults(CommentModel), this.getComments);
    router.post("/", protect, this.createComment);
    router.put("/:commentId", protect, this.updateComment);
    router.delete("/:commentId", protect, this.deleteComment);
    router.put("/:commentId/like", protect, this.likeComment);

    return router;
  }

  /**
   * @desc      Gets all comments
   * @route     GET /api/v1/comments
   * @access    Public
   */
  private static async getComments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return res.status(200).json(res.advancedResults);
  }

  /**
   * @desc      Creates a new comment
   * @route     POST /api/v1/comments
   * @access    Private: only authenticated users
   */
  private static async createComment(
    req: Request<{}, {}, Omit<RegisteringComment, "userId">>,
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

    // 1. Collect comment data
    const commentData: RegisteringComment = {
      text: req.body.text,
      userId: req.user._id,
      reviewId: req.body.reviewId,
      parentId: req.body.parentId,
    };

    // 2. check whether review exists
    const review = await ReviewModel.findById(req.body.reviewId);
    if (!review) {
      const error = new ErrorResponse({
        message: `Review with ID: ${req.body.reviewId} doesn't exist.`,
        statusCode: HttpStatusCode.NOT_FOUND,
      });
      return next(error);
    }

    try {
      // 3. Add the comment to database
      const comment = await CommentModel.create(commentData);
      res.status(HttpStatusCode.CREATED).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Edits a comment in the database
   * @route     PUT /api/v1/comments/:commentId
   * @access    Private: only authenticated users
   */
  private static async updateComment(
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

    // 2. check whether the comment exists
    let comment: IComment | null = null;
    try {
      comment = await CommentModel.findById(req.params.commentId);
      if (!comment) {
        const error = new ErrorResponse({
          message: `Comment with ID: ${req.params.commentId} doesn't exist.`,
          statusCode: HttpStatusCode.NOT_FOUND,
        });
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // 3. check whether the user is the author
    const isAuthor = comment.userId.equals(req.user._id);
    if (!isAuthor) {
      const error = new ErrorResponse({
        message: `User with ID: ${req.user._id} in not the author of the the comment with ID: ${req.params.commentId}.`,
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
      return next(error);
    }

    try {
      const comment = await CommentModel.findByIdAndUpdate(
        req.params.commentId,
        req.body,
        { returnDocument: "after" }
      );
      res.status(HttpStatusCode.OK).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Flags a comment as deleted (soft deletion)
   * @route     DELETE /api/v1/comments/:commentId
   * @access    Private: only authenticated users
   */
  private static async deleteComment(
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

    // 2. check whether the comment exists
    const comment = await CommentModel.findById(req.params.commentId);
    if (!comment) {
      const error = new ErrorResponse({
        message: `Comment with ID: ${req.params.commentId} doesn't exist.`,
        statusCode: HttpStatusCode.NOT_FOUND,
      });
      return next(error);
    }

    // 3. check whether the user is the author
    const isAuthor = comment.userId.equals(req.user._id);
    if (!isAuthor) {
      const error = new ErrorResponse({
        message: `User with ID: ${req.user._id} in not the author of the the comment with ID: ${req.params.commentId}.`,
        statusCode: HttpStatusCode.UNAUTHORIZED,
      });
      return next(error);
    }

    try {
      const comment = await CommentModel.findByIdAndUpdate(
        req.params.commentId,
        { $set: { isDeleted: true } },
        { returnDocument: "after" }
      );
      res.status(HttpStatusCode.OK).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc      Likes a comment
   * @route     PUT /api/v1/comments/:commentId/like
   * @access    Private: only authenticated users
   */
  private static async likeComment(
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

    // 2. check whether the comment exists
    const comment = await CommentModel.findById(req.params.commentId);
    if (!comment) {
      const error = new ErrorResponse({
        message: `Comment with ID: ${req.params.commentId} doesn't exist.`,
        statusCode: HttpStatusCode.NOT_FOUND,
      });
      return next(error);
    }

    // 3. check whether user already liked this comment
    const isLiked = comment.likes.some(
      (like) => req.user && like.equals(req.user._id)
    );
    try {
      const updatedComment = await CommentModel.findByIdAndUpdate(
        req.params.commentId,
        isLiked
          ? { $pull: { likes: req.user._id } }
          : { $addToSet: { likes: req.user._id } },
        { returnDocument: "after" }
      );
      res
        .status(HttpStatusCode.OK)
        .json({ success: true, data: updatedComment });
    } catch (error) {
      next(error);
    }
  }
}
