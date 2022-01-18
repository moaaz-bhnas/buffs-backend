import { Router } from "express";
import multer from "multer";
import {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadBootcampPhoto,
} from "../controllers/bootcamps";
import coursesRouter from "./courses";

const upload = multer({ dest: "uploads/" });

const router = Router();

router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

// router.route("/:id/photo").put(uploadBootcampPhoto);
router
  .route("/:id/photo")
  .put(upload.single("bootcamp-photo"), uploadBootcampPhoto);

// re-route
router.use("/:bootcampId/courses", coursesRouter);

export default router;
