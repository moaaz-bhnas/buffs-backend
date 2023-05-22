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
var chai_1 = require("chai");
var supertest_1 = __importDefault(require("supertest"));
var server_1 = __importDefault(require("../../server"));
var User_1 = __importDefault(require("../../models/User"));
// @desc      Register user
describe("POST /api/v1/auth/register", function () {
    describe("Email is valid", function () {
        var user = {
            name: "yuuri",
            email: "yuuri@yahoo.com",
            password: "yuuri228",
            role: "user",
        };
        afterEach(function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, User_1.default.deleteOne({
                                name: user.name,
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
        it("should respond with a (201: created) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/auth/register")
                            .send(user)];
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
                            .post("/api/v1/auth/register")
                            .send(user)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                        (0, chai_1.expect)(response.body.success).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Email is not valid", function () {
        var invalidUser = {
            name: "yuuri",
            email: "yuuri@yahoo",
            password: "yuuri228",
            role: "user",
        };
        it("should respond with a (400: bad request) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/auth/register")
                            .send(invalidUser)];
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
                            .post("/api/v1/auth/register")
                            .send(invalidUser)];
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
// @desc      Login user
describe("POST /api/v1/auth/login", function () {
    var user = {
        name: "yurio",
        email: "yurio@yahoo.com",
        password: "yurio228",
        role: "user",
    };
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_1.default.create(user)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    after(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_1.default.deleteOne({ name: user.name })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    describe("Email is valid", function () {
        var validCredentials = { email: user.email, password: user.password };
        it("should respond with a (200: ok) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/auth/login")
                            .send(validCredentials)];
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
                            .post("/api/v1/auth/login")
                            .send(validCredentials)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                        (0, chai_1.expect)(response.body.success).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("Email is not valid", function () {
        var invalidEmail = {
            email: "yurio@yahoo",
            password: user.password,
        };
        it("should respond with a (401: unauthorized) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/auth/login")
                            .send(invalidEmail)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.statusCode).to.equal(401);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should respond with json", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/auth/login")
                            .send(invalidEmail)];
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
// @desc      Logout user
describe("GET /api/v1/auth/logout", function () {
    it("should respond with a (200: ok) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default).get("/api/v1/auth/logout")];
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
                case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default).get("/api/v1/auth/logout")];
                case 1:
                    response = _a.sent();
                    (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                    (0, chai_1.expect)(response.body.success).to.equal(true);
                    return [2 /*return*/];
            }
        });
    }); });
});
// @desc      Get logged-in user via token
describe("GET /api/v1/auth/me", function () {
    var user = {
        name: "harry",
        email: "harry@yahoo.com",
        password: "harry228",
        role: "publisher",
    };
    var token = "";
    // Runs before all tests
    before(function getToken() {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/auth/register")
                            .send(user)];
                    case 1:
                        response = _a.sent();
                        token = response.body.token;
                        return [2 /*return*/];
                }
            });
        });
    });
    after(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_1.default.deleteOne({ name: user.name })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    describe("Token is valid", function () {
        it("should respond with a (200: ok) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .get("/api/v1/auth/me")
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
                            .get("/api/v1/auth/me")
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
});
// @desc      Forgot password
describe("POST /api/v1/auth/forgotpassword", function () {
    var user = {
        name: "yurio",
        email: "yurio@yahoo.com",
        password: "yurio228",
        role: "user",
    };
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_1.default.create(user)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    after(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_1.default.deleteOne({ name: user.name })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    describe("Email exists", function () {
        var validEmail = { email: user.email };
        it("should respond with a (200: ok) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/auth/forgotpassword")
                            .send(validEmail)];
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
                            .post("/api/v1/auth/forgotpassword")
                            .send(validEmail)];
                    case 1:
                        response = _a.sent();
                        (0, chai_1.expect)(response.headers["content-type"]).to.include("json");
                        (0, chai_1.expect)(response.body.success).to.equal(true);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("No user with that email", function () {
        var invalidEmail = { email: "yuuri@yahoo.com" };
        it("should respond with a (404: NOT FOUND) status code", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, supertest_1.default)(server_1.default)
                            .post("/api/v1/auth/forgotpassword")
                            .send(invalidEmail)];
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
                            .post("/api/v1/auth/forgotpassword")
                            .send(invalidEmail)];
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
