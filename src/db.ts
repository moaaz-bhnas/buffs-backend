import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI!;

const connectDB = async () => {
  const conn = await mongoose.connect(MONGO_URI);
  console.log(`mongodb connected: ${conn.connection.host}`);
};

export default connectDB;
