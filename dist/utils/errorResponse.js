"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorResponse = /** @class */ (function (_super) {
    __extends(ErrorResponse, _super);
    function ErrorResponse(_a) {
        var message = _a.message, statusCode = _a.statusCode, _b = _a.code, code = _b === void 0 ? 0 : _b, _c = _a.value, value = _c === void 0 ? "" : _c, _d = _a.keyValue, keyValue = _d === void 0 ? {} : _d, _e = _a.errors, errors = _e === void 0 ? [] : _e;
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.code = code;
        _this.value = value;
        _this.keyValue = keyValue;
        _this.errors = errors;
        return _this;
    }
    return ErrorResponse;
}(Error));
exports.default = ErrorResponse;
