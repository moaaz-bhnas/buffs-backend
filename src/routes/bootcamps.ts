import { Router } from "express";
import {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadBootcampPhoto,
} from "../controllers/bootcamps";
import advancedResults from "../middlewares/advancedResults";
import { authorize, protect } from "../middlewares/auth";
import multerUpload from "../middlewares/multerUpload";
import Bootcamp from "../models/Bootcamp";
import coursesRouter from "./courses";

const router = Router();

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/:id/photo")
  .put(
    protect,
    authorize("publisher", "admin"),
    multerUpload,
    uploadBootcampPhoto
  );

// re-route
router.use("/:bootcampId/courses", coursesRouter);

export default router;
