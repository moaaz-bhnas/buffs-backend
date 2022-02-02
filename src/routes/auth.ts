import { Router } from "express";
import { register } from "../controllers/auth";

const router = Router();

router.route("/register").post(register);

export default router;
