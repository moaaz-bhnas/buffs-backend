import express, { Application } from "express";
import "colorts/lib/string";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./db";
import cookieParser from "cookie-parser";
import auth from "./routes/auth";
import bootcamps from "./routes/bootcamps";
import courses from "./routes/courses";
import errorHandler from "./middlewares/error";
import path from "path";

// Load env variables
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();

const app: Application = express();

/* Middlewares:
- Middleware functions are functions that have access to the request object (req), the response object (res), and the next function in the application’s request-response cycle. The next function is a function in the Express router which, when invoked, executes the middleware succeeding the current middleware.
- Soruce: https://expressjs.com/en/guide/writing-middleware.html
- "middlewares are generally used to transform a request or response object, before it reaches to other middlewares." - https://stackoverflow.com/a/30408863/7982963
*/

// `.use()` for middlewares
app.use(express.urlencoded({ extended: true }));

// body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// logging
if (process.env.NODE_ENV) {
  app.use(morgan("dev")); // DEV logging middleware
}

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

// error handling
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, function () {
  console.log(
    `App listening in ${process.env.NODE_ENV} mode on port ${PORT}!`.yellow.bold
  );
});

// handle unhandled promise rejections
process.on("unhandledRejection", function (error: Error, promise) {
  console.log(`error: ${error.message}`.red);
  server.close(() => process.exit(1)); // "1": failure code
});

export default app;
