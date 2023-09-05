import { Router } from "express";
import advancedResults from "@/middlewares/advancedResults";
import UserModel from "@/schemas/UserSchema";
import usersController from "@/controllers/usersController";
import { protect } from "@/middlewares/protect";

const usersRouter = Router();

usersRouter
  .route("/")
  .get(advancedResults(UserModel), usersController.getUsers);

usersRouter.route("/:userId").get(usersController.getUser);

usersRouter.route("/:userId/follow").put(protect, usersController.followUser);

usersRouter
  .route("/:userId/unfollow")
  .put(protect, usersController.unfollowUser);

export default usersRouter;
