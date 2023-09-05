import { Router } from "express";
import authController from "../controllers/authController";
import { protect } from "../middlewares/protect";

const authRouter = Router();

// Register
authRouter.route("/register").post(authController.register);

// Login
authRouter.route("/login").post(authController.login);

// Login
authRouter.route("/logout").get(authController.logout);

// Get me
authRouter.route("/me").get(protect, authController.getMe);

// Forgot password
authRouter.route("/forgotpassword").post(authController.forgotPassword);

export default authRouter;
