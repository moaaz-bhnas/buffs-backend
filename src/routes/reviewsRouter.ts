import reviewsController from "@/controllers/reviewsController";
import advancedResults from "@/middlewares/advancedResults";
import { protect } from "@/middlewares/auth";
import ReviewModel from "@/schemas/ReviewSchema";
import { Router } from "express";

const reviewsRouter = Router();

reviewsRouter
  .route("/")
  .get(protect, advancedResults(ReviewModel), reviewsController.getReviews);

reviewsRouter.route("/").post(protect, reviewsController.createReview);

export default reviewsRouter;
