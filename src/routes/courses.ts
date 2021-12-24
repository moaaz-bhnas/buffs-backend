import { getCourse } from "./../controllers/courses";
import { Router } from "express";
import { getCourses } from "../controllers/courses";

const router = Router({ mergeParams: true });

router.route("/").get(getCourses);

router.route("/:id").get(getCourse);

export default router;
