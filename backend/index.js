/* eslint-disable no-undef */
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

import connectDB from "./utils/connectDB.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.listen(port, async () => {
  console.clear();
  await connectDB();
  console.log(`Server running on http://localhost:${port}`);
});
