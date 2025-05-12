/* eslint-disable no-undef */
import { connect } from "mongoose";

const dbURI = process.env.DB_URI;

async function dbConnect() {
  try {
    await connect(dbURI);
    console.log("Connected to database");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

export default dbConnect;
