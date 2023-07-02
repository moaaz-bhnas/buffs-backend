import reviewsController from "@/controllers/reviewsController";
import { protect } from "@/middlewares/auth";
import { Router } from "express";

const reviewsRouter = Router();

// Create a review
reviewsRouter.route("/").post(protect, reviewsController.createReview);

export default reviewsRouter;
