/* eslint-disable no-undef */
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";

import dbConnect from "./utils/dbConnect.js";
import authRoute from "./routes/auth.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ credentials: true, origin: "*" }));
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  try {
    res
      .status(200)
      .json({ resStatus: true, message: "Welcome to certura task 1 api" });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message
    });
  }
});

app.use("/api/auth/", authRoute);

app.all(/.*/, (req, res) => {
  try {
    res.status(404).json({
      resStatus: false,
      error: "Invalid request",
      message: "Route not found"
    });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message
    });
  }
});

app.listen(port, async () => {
  console.clear();
  await dbConnect();
  console.log(`Server is running http://localhost:${port}`);
});
