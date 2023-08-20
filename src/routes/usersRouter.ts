import { Router } from "express";
import advancedResults from "@/middlewares/advancedResults";
import UserModel from "@/schemas/UserSchema";
import usersController from "@/controllers/usersController";
import { protect } from "@/middlewares/auth";

const usersRouter = Router();

usersRouter
  .route("/")
  .get(advancedResults(UserModel), usersController.getUsers);

usersRouter.route("/:userId").get(usersController.getUser);

usersRouter.route("/:userId/follow").put(protect, usersController.followUser);

export default usersRouter;
