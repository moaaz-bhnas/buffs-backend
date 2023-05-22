"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var morgan_1 = __importDefault(require("morgan"));
var db_1 = __importDefault(require("./db"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var auth_1 = __importDefault(require("./routes/auth"));
var bootcamps_1 = __importDefault(require("./routes/bootcamps"));
var courses_1 = __importDefault(require("./routes/courses"));
var error_1 = __importDefault(require("./middlewares/error"));
var path_1 = __importDefault(require("path"));
var express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
var helmet_1 = __importDefault(require("helmet"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var hpp_1 = __importDefault(require("hpp"));
// import xss from "xss-clean";
var cors_1 = __importDefault(require("cors"));
// Load env variables
dotenv_1.default.config({ path: "./config/config.env" });
// connect to database
(0, db_1.default)();
var app = (0, express_1.default)();
/* Middlewares:
- Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.
- Soruce: https://expressjs.com/en/guide/writing-middleware.html
- "middlewares are generally used to transform a request or response object, before it reaches to other middlewares." - https://stackoverflow.com/a/30408863/7982963
*/
// `.use()` for middlewares
app.use(express_1.default.urlencoded({ extended: true }));
// body parser
app.use(express_1.default.json());
// Cookie parser
app.use((0, cookie_parser_1.default)());
// logging
if (process.env.NODE_ENV) {
    app.use((0, morgan_1.default)("dev")); // DEV logging middleware
}
// sanitize data
app.use((0, express_mongo_sanitize_1.default)());
// add security headers
app.use((0, helmet_1.default)());
// sanitize user input
// someone creates a bootcamp with the name: "someBootcamp <script></script>"
// app.use(xss());
// Rate limiting
var limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 100,
});
app.use(limiter);
// Prevent http param pollution
app.use((0, hpp_1.default)());
// Enable CORS
app.use((0, cors_1.default)());
// set static folder
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// mount routers
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/bootcamps", bootcamps_1.default);
app.use("/api/v1/courses", courses_1.default);
// error handling
app.use(error_1.default);
var PORT = process.env.PORT;
var server = app.listen(PORT, function () {
    console.log("App listening in " + process.env.NODE_ENV + " mode on port " + PORT + "!");
});
// handle unhandled promise rejections
process.on("unhandledRejection", function (error, promise) {
    console.log("error: " + error.message);
    server.close(function () { return process.exit(1); }); // "1": failure code
});
exports.default = app;
