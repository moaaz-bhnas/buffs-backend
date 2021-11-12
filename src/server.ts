import express, { Application } from "express";
import "colorts/lib/string";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./db";
import bootacamps from "./routes/bootcamps";

// Load env variables
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();

const app: Application = express();
// `.use()` for middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // body parser
if (process.env.NODE_ENV) {
  app.use(morgan("dev")); // DEV logging middleware
}
app.use("/api/v1/bootcamps", bootacamps);

const PORT = process.env.PORT || 5000;

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
