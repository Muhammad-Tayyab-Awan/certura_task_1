/* eslint-disable no-undef */
import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.clear();
  console.log(`Server running on http://localhost:${port}`);
});
