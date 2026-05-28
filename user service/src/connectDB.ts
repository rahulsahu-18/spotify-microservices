import mongoose from "mongoose"

export const connectDB = async ()=>{
  try {
    await mongoose.connect(process.env.DB_URL as string);
    console.log("db connected");
  } catch (error) {
    console.log("not connected db");
  }
}