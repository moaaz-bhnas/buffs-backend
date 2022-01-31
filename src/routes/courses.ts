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
  .post(createCourse);

router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

export default router;
