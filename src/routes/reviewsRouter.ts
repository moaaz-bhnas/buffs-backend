import reviewsController from "@/controllers/reviewsController";
import advancedResults from "@/middlewares/advancedResults";
import { protect } from "@/middlewares/protect";
import ReviewModel from "@/schemas/ReviewSchema";
import { Router } from "express";

const reviewsRouter = Router();

reviewsRouter
  .route("/")
  .get(protect, advancedResults(ReviewModel), reviewsController.getReviews);

reviewsRouter.route("/").post(protect, reviewsController.createReview);

reviewsRouter.route("/:reviewId").put(protect, reviewsController.updateReview);

reviewsRouter
  .route("/:reviewId")
  .delete(protect, reviewsController.deleteReview);

export default reviewsRouter;
