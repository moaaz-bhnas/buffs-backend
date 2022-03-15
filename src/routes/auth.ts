import { Router } from "express";
import { getMe, login, register } from "../controllers/auth";
import { protect } from "../middlewares/auth";

const router = Router();

// Register
router.route("/register").post(register);

// Login
router.route("/login").post(login);

// Get me
router.route("/me").get(protect, getMe);

export default router;
