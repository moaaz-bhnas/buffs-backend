import { Router } from "express";
import { getMe, login, register, forgotPassword } from "../controllers/auth";
import { protect } from "../middlewares/auth";

const router = Router();

// Register
router.route("/register").post(register);

// Login
router.route("/login").post(login);

// Get me
router.route("/me").get(protect, getMe);

// Forgot password
router.route("/forgotpassword").post(forgotPassword);

export default router;
