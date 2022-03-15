import {
  createCourse,
  deleteCourse,
  getCourse,
  updateCourse,
} from "./../controllers/courses";
import { Router } from "express";
import { getCourses } from "../controllers/courses";
import advancedResults from "../middlewares/advancedResults";
import CourseModel from "../models/Course";
import { protect } from "../middlewares/auth";

const router = Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(CourseModel, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, createCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

export default router;
