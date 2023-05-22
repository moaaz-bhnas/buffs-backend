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
exports.getBootcampsInRadius = exports.deleteBootcamp = exports.updateBootcamp = exports.createBootcamp = exports.getBootcamp = exports.getBootcamps = void 0;
var errorResponse_1 = __importDefault(require("../utils/errorResponse"));
var Bootcamp_1 = __importDefault(require("../models/Bootcamp"));
var asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
var geocoder_1 = __importDefault(require("../utils/geocoder"));
// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public: : any user can access
exports.getBootcamps = (0, asyncHandler_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.status(200).json(res.advancedResults);
            return [2 /*return*/];
        });
    });
});
// @desc      Get a single bootcamp
// @route     GET /api/v1/bootcamps/:id
// @access    Public
exports.getBootcamp = (0, asyncHandler_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, bootcamp, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    return [4 /*yield*/, Bootcamp_1.default.findById(id)];
                case 1:
                    bootcamp = _a.sent();
                    if (!bootcamp) {
                        error = new errorResponse_1.default({
                            message: "Bootcamp not found with id: " + id,
                            statusCode: 404,
                        });
                        return [2 /*return*/, next(error)];
                    }
                    res.status(200).json({ success: true, data: bootcamp });
                    return [2 /*return*/];
            }
        });
    });
});
// @desc      Create a bootcamp
// @route     POST /api/v1/bootcamps
// @access    Private: Only specific users
exports.createBootcamp = (0, asyncHandler_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var publishedBootcamp, error, bootcamp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Bootcamp_1.default.findOne({ user: req.user.id })];
                case 1:
                    publishedBootcamp = _a.sent();
                    if (req.user.role !== "admin" && publishedBootcamp) {
                        error = new errorResponse_1.default({
                            statusCode: 400,
                            message: "User with ID: " + req.user.id + " has already published a bootcamp",
                        });
                        return [2 /*return*/, next(error)];
                    }
                    // Add user to body
                    req.body.user = req.user.id;
                    return [4 /*yield*/, Bootcamp_1.default.create(req.body)];
                case 2:
                    bootcamp = _a.sent();
                    res.status(201).json({ success: true, data: bootcamp });
                    return [2 /*return*/];
            }
        });
    });
});
// @desc      Update a bootcamp
// @route     PUT /api/v1/bootcamps/:id
// @access    Private
exports.updateBootcamp = (0, asyncHandler_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, bootcamp, error, error, updatedBootcamp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    return [4 /*yield*/, Bootcamp_1.default.findById(id)];
                case 1:
                    bootcamp = _a.sent();
                    if (!bootcamp) {
                        error = new errorResponse_1.default({
                            message: "Bootcamp not found with id: " + id,
                            statusCode: 404,
                        });
                        next(error);
                    }
                    if ((bootcamp === null || bootcamp === void 0 ? void 0 : bootcamp.user.toString()) !== req.user.id && req.user.role !== "admin") {
                        error = new errorResponse_1.default({
                            message: "User: " + req.user.id + " is not authorized to update this bootcamp",
                            statusCode: 401,
                        });
                        return [2 /*return*/, next(error)];
                    }
                    return [4 /*yield*/, Bootcamp_1.default.findByIdAndUpdate(id, req.body, {
                            new: true,
                            runValidators: true,
                        })];
                case 2:
                    updatedBootcamp = _a.sent();
                    res.status(200).json({ success: true, data: updatedBootcamp });
                    return [2 /*return*/];
            }
        });
    });
});
// @desc      Delete a bootcamp
// @route     DELETE /api/v1/bootcamps/:id
// @access    Private
exports.deleteBootcamp = (0, asyncHandler_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var id, bootcamp, error, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    return [4 /*yield*/, Bootcamp_1.default.findById(id)];
                case 1:
                    bootcamp = _a.sent();
                    if (!bootcamp) {
                        error = new errorResponse_1.default({
                            message: "Bootcamp not found with id: " + id,
                            statusCode: 404,
                        });
                        return [2 /*return*/, next(error)];
                    }
                    if ((bootcamp === null || bootcamp === void 0 ? void 0 : bootcamp.user.toString()) !== req.user.id && req.user.role !== "admin") {
                        error = new errorResponse_1.default({
                            message: "User: " + req.user.id + " is not authorized to delete this bootcamp",
                            statusCode: 401,
                        });
                        return [2 /*return*/, next(error)];
                    }
                    return [4 /*yield*/, bootcamp.deleteOne()];
                case 2:
                    _a.sent();
                    res.status(200).json({ success: true, data: bootcamp });
                    return [2 /*return*/];
            }
        });
    });
});
// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Public
exports.getBootcampsInRadius = (0, asyncHandler_1.default)(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, zipcode, distance, location, _b, longitude, latitude, bootcamps;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = req.params, zipcode = _a.zipcode, distance = _a.distance;
                    return [4 /*yield*/, geocoder_1.default.geocode(zipcode)];
                case 1:
                    location = _c.sent();
                    _b = location[0], longitude = _b.longitude, latitude = _b.latitude;
                    return [4 /*yield*/, Bootcamp_1.default.find({
                            location: {
                                $geoWithin: { $centerSphere: [[longitude, latitude], distance] },
                            },
                        })];
                case 2:
                    bootcamps = _c.sent();
                    console.log("getBootcampsInRadius - bootcamps: ", bootcamps.length);
                    res
                        .status(200)
                        .json({ success: true, count: bootcamps.length, data: bootcamps });
                    return [2 /*return*/];
            }
        });
    });
});
