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
exports.authorize = exports.protect = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var errorResponse_1 = __importDefault(require("../utils/errorResponse"));
var asyncHandler_1 = __importDefault(require("./asyncHandler"));
var User_1 = __importDefault(require("../models/User"));
// Protect routes
// Makes sure it's a logged-in user
exports.protect = (0, asyncHandler_1.default)(function (req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var token, error, decoded, id, _b, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (req.headers.authorization &&
                        req.headers.authorization.startsWith("Bearer") // formatted correctly check
                    ) {
                        token = req.headers.authorization.split(" ")[1];
                    }
                    else if (req.cookies.token) {
                        token = req.cookies.token;
                        /*
                        Now even if the token isn't sent with the request, it'll be the cookie
                        and request is still gonna work
                        */
                    }
                    console.log("token: ", typeof token);
                    // Make sure token exists
                    if (!token || token === "null" || token === "none") {
                        console.log("ErrorResponse");
                        error = new errorResponse_1.default({
                            message: "Not authorized to access this route",
                            statusCode: 401,
                        });
                        return [2 /*return*/, next(error)];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    decoded = jsonwebtoken_1.default.verify(token, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "");
                    id = decoded.id;
                    _b = req;
                    return [4 /*yield*/, User_1.default.findById(id)];
                case 2:
                    _b.user = _c.sent();
                    next();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _c.sent();
                    console.error(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
function authorize() {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return function (req, res, next) {
        if (!roles.includes(req.user.role)) {
            var error = new errorResponse_1.default({
                message: "User role \"" + req.user.role + "\" not authorized to access this route",
                statusCode: 403,
            });
            return next(error);
        }
        next();
    };
}
exports.authorize = authorize;
