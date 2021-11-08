import express, { Application, Router } from "express";
import dotenv from "dotenv";

const bootacamp: Router = require("./routes/bootcamps");

// Load env variables
dotenv.config({ path: "./config/config.env" });

const app: Application = express();

app.use("/api/v1/bootcamps", bootacamp);

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`App listening in ${process.env.NODE_ENV} mode on port ${PORT}!`);
});
