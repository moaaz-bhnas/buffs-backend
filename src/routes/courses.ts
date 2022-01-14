import {
  createCourse,
  getCourse,
  updateCourse,
} from "./../controllers/courses";
import { Router } from "express";
import { getCourses } from "../controllers/courses";

const router = Router({ mergeParams: true });

router.route("/").get(getCourses).post(createCourse);

router.route("/:id").get(getCourse).put(updateCourse);

export default router;
