import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");
    console.log("Database name:", mongoose.connection.db?.databaseName);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
