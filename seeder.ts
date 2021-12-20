import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import "colorts/lib/string";

// Load env variables
dotenv.config({ path: "./config/config.env" });

import Bootcamp from "./src/models/Bootcamp";

const MONGO_URI = process.env.MONGO_URI!;

const connectDB = async () => {
  const conn = await mongoose.connect(MONGO_URI);
  console.log(`mongodb connected: ${conn.connection.host}`.cyan.underline.bold);
};

connectDB();

const bootcamps: object[] = JSON.parse(
  fs.readFileSync(`${__dirname}/src/_data/bootcamps.json`, "utf-8")
);

console.log("bootcamps count:", bootcamps.length);

// import into db
async function importData() {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

async function deleteData() {
  try {
    await Bootcamp.deleteMany();
    console.log("Data deleted...".red.inverse);
    process.exit();
  } catch (error) {
    console.error(error);
  }
}

switch (process.argv[2]) {
  case "i":
    importData();
    break;
  case "d":
    deleteData();
    break;
}
