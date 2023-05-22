"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourse = exports.getCourses = void 0;
var errorResponse_1 = __importDefault(require("../utils/errorResponse"));
var Course_1 = __importDefault(require("../models/Course"));
var asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
var Bootcamp_1 = __importDefault(require("../models/Bootcamp"));
// @desc      Get all courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = (0, asyncHandler_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var courses;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.params.bootcampId) return [3 /*break*/, 2];
                    return [4 /*yield*/, Course_1.default.find({ bootcamp: req.params.bootcampId })];
                case 1:
                    courses = _a.sent();
                    res.status(200).json({
                        success: true,
                        count: courses.length,
                        data: courses,
                    });
                    return [3 /*break*/, 3];
                case 2:
                    res.status(200).json(res.advancedResults);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
});
// @desc      Get a single courses
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = (0, asyncHandler_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var course, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Course_1.default.findById(req.params.id).populate({
                        path: "bootcamp",
                        select: "name description",
                    })];
                case 1:
                    course = _a.sent();
                    if (!course) {
                        error = new errorResponse_1.default({
                            message: "Course not found with id: " + req.params.id,
                            statusCode: 404,
                        });
                        return [2 /*return*/, next(error)];
                    }
                    res.status(200).json({
                        success: true,
                        data: course,
                    });
                    return [2 /*return*/];
            }
        });
    });
});
// @desc      Create a course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.createCourse = (0, asyncHandler_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var bootcamp, error, error, course;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req.body.bootcamp = req.params.bootcampId;
                    return [4 /*yield*/, Bootcamp_1.default.findById(req.params.bootcampId)];
                case 1:
                    bootcamp = _a.sent();
                    // Does the bootcamp even exist?
                    if (!bootcamp) {
                        error = new errorResponse_1.default({
                            message: "Bootcamp not found with id: " + req.params.bootcampId,
                            statusCode: 404,
                        });
                        return [2 /*return*/, next(error)];
                    }
                    // Are you the bootcamp owner?
                    if ((bootcamp === null || bootcamp === void 0 ? void 0 : bootcamp.user.toString()) !== req.user.id && req.user.role !== "admin") {
                        error = new errorResponse_1.default({
                            message: "User: " + req.user.id + " is not authorized to add course to bootcamp: " + req.body.bootcamp,
                            statusCode: 401,
                        });
                        return [2 /*return*/, next(error)];
                    }
                    // Add user to body
                    req.body.user = req.user.id;
                    return [4 /*yield*/, Course_1.default.create(req.body)];
                case 2:
                    course = _a.sent();
                    res.status(201).json({ success: true, data: course });
                    return [2 /*return*/];
            }
        });
    });
});
// @desc      Update a course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = (0, asyncHandler_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, course, error, error, updatedCourse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    return [4 /*yield*/, Course_1.default.findById(id)];
                case 1:
                    course = _a.sent();
                    if (!course) {
                        error = new errorResponse_1.default({
                            message: "Course not found with id: " + id,
                            statusCode: 404,
                        });
                        return [2 /*return*/, next(error)];
                    }
                    // Are you the course owner?
                    if ((course === null || course === void 0 ? void 0 : course.user.toString()) !== req.user.id && req.user.role !== "admin") {
                        error = new errorResponse_1.default({
                            message: "User: " + req.user.id + " is not authorized to update course: " + course._id,
                            statusCode: 401,
                        });
                        return [2 /*return*/, next(error)];
                    }
                    return [4 /*yield*/, Course_1.default.findByIdAndUpdate(id, req.body, {
                            new: true,
                            runValidators: true,
                        })];
                case 2:
                    updatedCourse = _a.sent();
                    res.status(200).json({ success: true, data: updatedCourse });
                    return [2 /*return*/];
            }
        });
    });
});
// @desc      Delete a course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = (0, asyncHandler_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, course, error, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    return [4 /*yield*/, Course_1.default.findById(id)];
                case 1:
                    course = _a.sent();
                    if (!course) {
                        error = new errorResponse_1.default({
                            message: "Course not found with id: " + id,
                            statusCode: 404,
                        });
                        return [2 /*return*/, next(error)];
                    }
                    // Are you the course owner?
                    if ((course === null || course === void 0 ? void 0 : course.user.toString()) !== req.user.id && req.user.role !== "admin") {
                        error = new errorResponse_1.default({
                            message: "User: " + req.user.id + " is not authorized to delete course: " + course._id,
                            statusCode: 401,
                        });
                        return [2 /*return*/, next(error)];
                    }
                    return [4 /*yield*/, course.deleteOne()];
                case 2:
                    _a.sent();
                    res.status(200).json({ success: true, data: course });
                    return [2 /*return*/];
            }
        });
    });
});
