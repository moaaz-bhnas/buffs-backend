"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_geocoder_1 = __importDefault(require("node-geocoder"));
var options = {
    provider: "mapquest",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null,
};
var geocoder = (0, node_geocoder_1.default)(options);
exports.default = geocoder;
