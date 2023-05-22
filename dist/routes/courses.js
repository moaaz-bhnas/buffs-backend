"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var courses_1 = require("./../controllers/courses");
var express_1 = require("express");
var courses_2 = require("../controllers/courses");
var advancedResults_1 = __importDefault(require("../middlewares/advancedResults"));
var Course_1 = __importDefault(require("../models/Course"));
var auth_1 = require("../middlewares/auth");
var router = (0, express_1.Router)({ mergeParams: true });
router
    .route("/")
    .get((0, advancedResults_1.default)(Course_1.default, {
    path: "bootcamp",
    select: "name description",
}), courses_2.getCourses)
    .post(auth_1.protect, (0, auth_1.authorize)("publisher", "admin"), courses_1.createCourse);
router
    .route("/:id")
    .get(courses_1.getCourse)
    .put(auth_1.protect, (0, auth_1.authorize)("publisher", "admin"), courses_1.updateCourse)
    .delete(auth_1.protect, (0, auth_1.authorize)("publisher", "admin"), courses_1.deleteCourse);
exports.default = router;
