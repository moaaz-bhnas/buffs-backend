import { Router } from "express";
import advancedResults from "@/middlewares/advancedResults";
import UserModel from "@/models/UserModel";
import usersController from "@/controllers/usersController";

const router = Router();

router.route("/").get(advancedResults(UserModel), usersController.getUsers);

router.route("/:id").get(usersController.getUser);

export default router;
