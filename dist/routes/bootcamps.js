"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var bootcamps_1 = require("../controllers/bootcamps");
var advancedResults_1 = __importDefault(require("../middlewares/advancedResults"));
var auth_1 = require("../middlewares/auth");
var Bootcamp_1 = __importDefault(require("../models/Bootcamp"));
var courses_1 = __importDefault(require("./courses"));
var router = (0, express_1.Router)();
router
    .route("/")
    .get((0, advancedResults_1.default)(Bootcamp_1.default, "courses"), bootcamps_1.getBootcamps)
    .post(auth_1.protect, (0, auth_1.authorize)("publisher", "admin"), bootcamps_1.createBootcamp);
router
    .route("/:id")
    .get(bootcamps_1.getBootcamp)
    .put(auth_1.protect, (0, auth_1.authorize)("publisher", "admin"), bootcamps_1.updateBootcamp)
    .delete(auth_1.protect, (0, auth_1.authorize)("publisher", "admin"), bootcamps_1.deleteBootcamp);
router.route("/radius/:zipcode/:distance").get(bootcamps_1.getBootcampsInRadius);
// re-route
router.use("/:bootcampId/courses", courses_1.default);
exports.default = router;
