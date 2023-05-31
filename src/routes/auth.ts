import { Router } from "express";
import authController from "../controllers/authController";
import { protect } from "../middlewares/auth";

const router = Router();

// Register
router.route("/register").post(authController.register);

// Login
router.route("/login").post(authController.login);

// Login
router.route("/logout").get(authController.logout);

// Get me
router.route("/me").get(protect, authController.getMe);

// Forgot password
router.route("/forgotpassword").post(authController.forgotPassword);

export default router;
