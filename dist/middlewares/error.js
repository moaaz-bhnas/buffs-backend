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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var errorResponse_1 = __importDefault(require("../utils/errorResponse"));
function errorHandler(error, req, res, next) {
    console.error("error.name: ", error.name);
    var errorResponse = __assign({}, error);
    errorResponse.message = error.message;
    // mongoose bad ObjectId
    if (error.name === "CastError") {
        var message = "resource not found";
        errorResponse = new errorResponse_1.default({ message: message, statusCode: 404 });
    }
    // mongoose missing required field
    if (error.name === "ValidationError") {
        var message = Object.values(error.errors)
            .map(function (error) { return error.message; })
            .join(", ");
        errorResponse = new errorResponse_1.default({ message: message, statusCode: 400 });
    }
    // mongoose duplicate field
    if (error.code === 11000) {
        var keyValue = error.keyValue;
        var key = Object.keys(keyValue)[0];
        var message = "duplicate field value is passed: { " + key + ": " + keyValue[key] + " }";
        errorResponse = new errorResponse_1.default({ message: message, statusCode: 400 });
    }
    res.status(errorResponse.statusCode || 500).json({
        success: false,
        error: errorResponse.message || "server error",
    });
}
exports.default = errorHandler;
