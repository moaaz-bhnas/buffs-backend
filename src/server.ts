import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";

// Load env variables
dotenv.config({ path: "./config/config.env" });

const app: Application = express();

// create a route
app.get("/api/v1/bootcamps", function (req: Request, res: Response) {
  /* 
  - sending data from server
  res.send({ name: "Pariston" });

  - sending json data
  res.json({ name: "Pariston" });

  - sending status (only)
  res.sendStatus(300); // just sends a status

  - status with data
  res.status(200).json({ success: true });
  */

  res.status(200).json({ success: true, msg: "Show all bootcamps" });
});

app.post("/api/v1/bootcamps", function (req: Request, res: Response) {
  res.status(201).json({ success: true, msg: "Create a new bootacamp" });
});

app.put("/api/v1/bootcamps/:id", function (req: Request, res: Response) {
  res
    .status(200)
    .json({ success: true, msg: `Delete a bootcamp ${req.params.id}` });
});

app.delete("/api/v1/bootcamps/:id", function (req: Request, res: Response) {
  res
    .status(200)
    .json({ success: true, msg: `Delete a bootcamp ${req.params.id}` });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`App listening in ${process.env.NODE_ENV} mode on port ${PORT}!`);
});
