import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

const MONGO_URI = process.env.MONGO_URI!;

const connectDB = async () => {
  const conn = await mongoose.connect(MONGO_URI);
  console.log(`mongodb connected: ${conn.connection.host}`.cyan.underline.bold);
};

export default connectDB;
