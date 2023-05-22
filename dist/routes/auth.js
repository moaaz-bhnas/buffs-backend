"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../controllers/auth");
var auth_2 = require("../middlewares/auth");
var router = (0, express_1.Router)();
// Register
router.route("/register").post(auth_1.register);
// Login
router.route("/login").post(auth_1.login);
// Login
router.route("/logout").get(auth_1.logout);
// Get me
router.route("/me").get(auth_2.protect, auth_1.getMe);
// Forgot password
router.route("/forgotpassword").post(auth_1.forgotPassword);
exports.default = router;
