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
import { authorize, protect } from "../middlewares/auth";

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
  .post(protect, authorize("publisher", "admin"), createCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

export default router;
