/* eslint-disable no-undef */
import { connect } from "mongoose";
const dbURI = process.env.DB_URI;

async function connectDB() {
  try {
    await connect(dbURI);
    connect;
    console.log("Database connection established successfully");
  } catch (error) {
    console.log("Database connection failed, Error:", error.message);
  }
}

export default connectDB;
