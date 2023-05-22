"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var chai_1 = require("chai");
var supertest_1 = __importDefault(require("supertest"));
var server_1 = __importDefault(require("../../server"));
// @desc      Get all courses
describe("GET /api/v1/courses", function () {
    it("should respond with a (200: ok) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default).get("/api/v1/courses")];
                case 1:
                    response = _a.sent();
                    (0, chai_1.expect)(response.statusCode).to.equal(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should respond with json", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default).get("/api/v1/courses")];
                case 1:
                    response = _a.sent();
                    (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                    (0, chai_1.expect)(response.body.success).to.equal(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
// @desc      Get all bootcamp courses
describe("GET /api/v1/bootcamps/:bootcampId/courses", function () {
    var bootcampId = "5d713995b721c3bb38c1f5d0";
    it("should respond with a (200: ok) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default).get("/api/v1/bootcamps/" + bootcampId + "/courses")];
                case 1:
                    response = _a.sent();
                    (0, chai_1.expect)(response.statusCode).to.equal(200);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should respond with json", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default).get("/api/v1/bootcamps/" + bootcampId + "/courses")];
                case 1:
                    response = _a.sent();
                    (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                    (0, chai_1.expect)(response.body.success).to.equal(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
// @desc      Get a single course
describe("GET /api/v1/courses/:id", function () {
    describe("course exists", function () {
        var courseId = "5d725a4a7b292f5f8ceff789";
        it("should respond with a (200: ok) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default).get("/api/v1/courses/" + courseId)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.statusCode).to.equal(200);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should respond with json", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default).get("/api/v1/courses/" + courseId)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                        (0, chai_1.expect)(response.body.success).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("course doesn't exist", function () {
        var nonExistentId = "5d725a4a7b292f5f8ceff000";
        it("should respond with a (404: not found) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default).get("/api/v1/courses/" + nonExistentId)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.statusCode).to.equal(404);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should respond with json", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default).get("/api/v1/courses/" + nonExistentId)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                        (0, chai_1.expect)(response.body.success).to.equal(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
// @desc      Create a course in a bootcamp
describe("POST /api/v1/bootcamps/:bootcampId/courses", function () {
    var token = "";
    // Runs before all tests
    before(function getToken() {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/auth/login")
                            .send({ email: "john@gmail.com", password: "123456" })];
                    case 1:
                        response = _a.sent();
                        token = response.body.token;
                        return [2 /*return*/];
                }
            });
        });
    });
    var bootcampId = "5d713995b721c3bb38c1f5d0";
    var course = {
        _id: "5d725a4a7b292f5f8ceff789",
        title: "Front End Web Development",
        description: "This course will provide you with all of the essentials to become a successful frontend web developer. You will learn to master HTML, CSS and front end JavaScript, along with tools like Git, VSCode and front end frameworks like Vue",
        weeks: 8,
        tuition: 8000,
        minimumSkill: "beginner",
        scholarhipsAvailable: true,
        bootcamp: "5d713995b721c3bb38c1f5d0",
        user: "5d7a514b5d2c12c7449be045",
    };
    // runs before each test in this block
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .delete("/api/v1/courses/" + course._id)
                            .set("Authorization", "Bearer " + token)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    describe("course document is valid", function () {
        it("should respond with a (201: created) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/bootcamps/" + bootcampId + "/courses")
                            .set("Authorization", "Bearer " + token)
                            .send(course)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.statusCode).to.equal(201);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should respond with json", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/bootcamps/" + bootcampId + "/courses")
                            .set("Authorization", "Bearer " + token)
                            .send(course)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                        (0, chai_1.expect)(response.body.success).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("required field is missing (title)", function () {
        var invalidCourse = __assign({}, course);
        delete invalidCourse.title;
        it("should respond with a (400: bad request) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/bootcamps/" + bootcampId + "/courses")
                            .set("Authorization", "Bearer " + token)
                            .send(invalidCourse)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.statusCode).to.equal(400);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should respond with json", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/bootcamps/" + bootcampId + "/courses")
                            .set("Authorization", "Bearer " + token)
                            .send(invalidCourse)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                        (0, chai_1.expect)(response.body.success).to.equal(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("unique field is duplicate (title)", function () {
        it("should respond with a (400: bad request) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/bootcamps/" + bootcampId + "/courses")
                            .set("Authorization", "Bearer " + token)
                            .send(course)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                                .post("/api/v1/bootcamps/" + bootcampId + "/courses")
                                .set("Authorization", "Bearer " + token)
                                .send(course)];
                    case 2:
                        response = _a.sent();
                        (0, chai_1.expect)(response.statusCode).to.equal(400);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should respond with json", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/bootcamps/" + bootcampId + "/courses")
                            .set("Authorization", "Bearer " + token)
                            .send(course)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                                .post("/api/v1/bootcamps/" + bootcampId + "/courses")
                                .set("Authorization", "Bearer " + token)
                                .send(course)];
                    case 2:
                        response = _a.sent();
                        (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                        (0, chai_1.expect)(response.body.success).to.equal(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
// @desc      Update a course
describe("PUT /api/v1/courses/:id", function () {
    var token = "";
    // Runs before all tests
    before(function getToken() {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/auth/login")
                            .send({ email: "john@gmail.com", password: "123456" })];
                    case 1:
                        response = _a.sent();
                        token = response.body.token;
                        return [2 /*return*/];
                }
            });
        });
    });
    describe("course exists", function () {
        var courseId = "5d725a4a7b292f5f8ceff789";
        it("should respond with a (200: ok) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .put("/api/v1/courses/" + courseId)
                            .set("Authorization", "Bearer " + token)
                            .send({ scholarshipAvailable: false })];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.statusCode).to.equal(200);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should respond with json", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .put("/api/v1/courses/" + courseId)
                            .set("Authorization", "Bearer " + token)
                            .send({ scholarshipAvailable: true })];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                        (0, chai_1.expect)(response.body.success).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("course doesn't exist", function () {
        var nonExistentId = "5d725c84c4ded7bcb4800000";
        it("should respond with a (404: not found) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .put("/api/v1/courses/" + nonExistentId)
                            .set("Authorization", "Bearer " + token)
                            .send({ scholarshipAvailable: false })];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.statusCode).to.equal(404);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should respond with json", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .put("/api/v1/courses/" + nonExistentId)
                            .set("Authorization", "Bearer " + token)
                            .send({ scholarshipAvailable: false })];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                        (0, chai_1.expect)(response.body.success).to.equal(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
// @desc      Delete a course
describe("DELETE /api/v1/courses/:id", function () {
    var token = "";
    // Runs before all tests
    before(function getToken() {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/auth/login")
                            .send({ email: "john@gmail.com", password: "123456" })];
                    case 1:
                        response = _a.sent();
                        token = response.body.token;
                        return [2 /*return*/];
                }
            });
        });
    });
    describe("course exists", function () {
        var course = {
            _id: "5d725a4a7b292f5f8ceff789",
            title: "Front End Web Development",
            description: "This course will provide you with all of the essentials to become a successful frontend web developer. You will learn to master HTML, CSS and front end JavaScript, along with tools like Git, VSCode and front end frameworks like Vue",
            weeks: 8,
            tuition: 8000,
            minimumSkill: "beginner",
            scholarhipsAvailable: true,
            bootcamp: "5d713995b721c3bb38c1f5d0",
            user: "5d7a514b5d2c12c7449be045",
        };
        afterEach(function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                                .post("/api/v1/bootcamps/" + course.bootcamp + "/courses")
                                .set("Authorization", "Bearer " + token)
                                .send(course)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("should respond with a (200: ok) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .delete("/api/v1/courses/" + course._id)
                            .set("Authorization", "Bearer " + token)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.statusCode).to.equal(200);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should respond with json", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .delete("/api/v1/courses/" + course._id)
                            .set("Authorization", "Bearer " + token)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                        (0, chai_1.expect)(response.body.success).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("course doesn't exist", function () {
        var nonExistentId = "5d725a4a7b292f5f8cef7777";
        it("should respond with a (404: not found) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .delete("/api/v1/courses/" + nonExistentId)
                            .set("Authorization", "Bearer " + token)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.statusCode).to.equal(404);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should respond with json", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .delete("/api/v1/courses/" + nonExistentId)
                            .set("Authorization", "Bearer " + token)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                        (0, chai_1.expect)(response.body.success).to.equal(false);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
