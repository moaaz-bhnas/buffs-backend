"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
exports.default = asyncHandler;
