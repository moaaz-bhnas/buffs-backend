import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  if (!MONGO_URI) {
    console.error(`Add MONGO_URI to Doppler 🙄`);
    return;
  }
  const conn = await mongoose.connect(MONGO_URI);
  console.log(`Connected to MongoDB 🥭`);
};

export default connectDB;
