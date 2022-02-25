import { Router } from "express";
import { login, register } from "../controllers/auth";

const router = Router();

// Register
router.route("/register").post(register);

// Login
router.route("/login").post(login);

export default router;
