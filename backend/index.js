/* eslint-disable no-undef */
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser);
app.use(bodyParser.json());

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

app.listen(port, () => {
  console.clear();
  console.log(`Server is running http://localhost:${port}`);
});
