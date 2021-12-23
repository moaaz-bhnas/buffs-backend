import { Router } from "express";
import { getCourses } from "../controllers/courses";

const router = Router({ mergeParams: true });

router.route("/").get(getCourses);

export default router;
