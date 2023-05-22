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
Object.defineProperty(exports, "__esModule", { value: true });
function removeReservedParams(query, params) {
    var queryCopy = __assign({}, query);
    params.forEach(function (param) { return delete queryCopy[param]; });
    return queryCopy;
}
function addDollarSignToOperators(query) {
    var queryString = JSON.stringify(query);
    queryString = queryString.replace(/\b(lt|lte|gt|gte|in)\b/g, function (match) { return "$" + match; });
    var newQuery = JSON.parse(queryString);
    return newQuery;
}
function default_1(model, populate) {
    return function advancedResults(req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var reservedParams, formattedQuery, query, fields, sortBy, page, limit, startIndex, endIndex, total, results, pagination;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reservedParams = ["select", "sort", "page", "limit"];
                        formattedQuery = removeReservedParams(req.query, reservedParams);
                        // create operators (e.g. $lt, $gt)
                        formattedQuery = addDollarSignToOperators(formattedQuery);
                        query = model.find(formattedQuery);
                        // projection
                        if (req.query.select) {
                            fields = req.query.select.split(",").join(" ");
                            query = query.select(fields); // e.g. .select(name, description)
                        }
                        // sorting
                        if (req.query.sort) {
                            sortBy = req.query.sort.split(",").join(" ");
                            query = query.sort(sortBy); // e.g. .sort(-name)
                        }
                        page = parseInt(req.query.page) || 1;
                        limit = parseInt(req.query.limit) || 25;
                        startIndex = (page - 1) * limit;
                        endIndex = page * limit;
                        return [4 /*yield*/, model.countDocuments()];
                    case 1:
                        total = _a.sent();
                        query = query.skip(startIndex).limit(limit);
                        if (populate) {
                            query = query.populate(populate);
                        }
                        return [4 /*yield*/, query];
                    case 2:
                        results = _a.sent();
                        pagination = {};
                        if (startIndex > 0) {
                            pagination.prev = {
                                page: page - 1,
                                limit: limit,
                            };
                        }
                        if (endIndex < total) {
                            pagination.next = {
                                page: page + 1,
                                limit: limit,
                            };
                        }
                        res.advancedResults = {
                            success: true,
                            count: results.length,
                            pagination: pagination,
                            data: results,
                        };
                        next();
                        return [2 /*return*/];
                }
            });
        });
    };
}
exports.default = default_1;
