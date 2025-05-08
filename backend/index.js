/* eslint-disable no-undef */
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

import connectDB from "./utils/connectDB.js";
import registerRoute from "./routes/auth/register.js";
import uploadRoute from "./routes/upload.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  try {
    res
      .status(200)
      .json({ resStatus: true, message: "Welcome to BlogPress API" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error Occurred on Server Side",
      message: error.message,
    });
  }
});

app.use("/api/v1/auth/register", registerRoute);
app.use("/api/v1/upload/", uploadRoute);

app.all(/.*/, (req, res) => {
  try {
    res.status(404).json({ resStatus: false, error: "Route not found" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error Occurred on Server Side",
      message: error.message,
    });
  }
});

app.listen(port, async () => {
  console.clear();
  await connectDB();
  console.log(`Server running on http://localhost:${port}`);
});
