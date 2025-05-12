import { Router } from "express";
import { body, validationResult } from "express-validator";

import Blog from "../models/Blog.js";

const router = Router();

router.post(
  "/create",
  [
    body("title")
      .matches(/^[a-bA-b ]/)
      .isLength({ min: 15, max: 100 }),
    body("content")
      .matches(/^[A-Za-z0-9 .,!?'"()\-_:;@#&*/\\\[\]{}<>|+=~`%^$]/)
      .isLength({ min: 300, max: 3000 }),
    body("imageURL").isURL({})
  ],
  async (req, res) => {
    try {
      const { userStatus } = req;
      if (!userStatus.loggedIn) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Please login first to create a new blog"
        });
      }
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Please provide correct values to create a new blog"
        });
      }
      const { title, content, imageURL } = req.body;
      const blogCheck = await Blog.findOne({ title: title });
      if (blogCheck) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Blog with this title already exist"
        });
      }
      await Blog.create({
        title: title,
        content: content,
        coverImageURL: imageURL,
        author: userStatus.userId
      });
      res.status(200).json({
        resStatus: true,
        message: "Blog created successfully"
      });
    } catch (error) {
      res.status(500).json({
        resStatus: false,
        error: "Server error found",
        message: error.message
      });
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!userStatus.loggedIn) {
      return res.status(400).json({
        resStatus: false,
        error: "Invalid request",
        message: "Please login first to get all of your blogs"
      });
    }
    const allBlogs = await Blog.find({ author: userStatus.userId });
    res.status(200).json({
      resStatus: true,
      myBlogs: allBlogs
    });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const allBlogs = await Blog.find();
    res.status(200).json({
      resStatus: true,
      allBlogs
    });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!userStatus.loggedIn) {
      return res.status(400).json({
        resStatus: false,
        error: "Invalid request",
        message: "Please login first to delete all of your blogs"
      });
    }
    await Blog.deleteMany({ author: userStatus.userId });
    res.status(200).json({
      resStatus: true,
      message: "All of your blogs deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message
    });
  }
});

export default router;
