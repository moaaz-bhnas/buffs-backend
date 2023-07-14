import { Router } from "express";
import advancedResults from "@/middlewares/advancedResults";
import UserModel from "@/schemas/UserSchema";
import usersController from "@/controllers/usersController";

const usersRouter = Router();

usersRouter
  .route("/")
  .get(advancedResults(UserModel), usersController.getUsers);

usersRouter.route("/:id").get(usersController.getUser);

export default usersRouter;
