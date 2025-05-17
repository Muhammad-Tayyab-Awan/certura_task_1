import { Router } from "express";
import { body, param, validationResult } from "express-validator";

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
      .isLength({ min: 300, max: 10000 }),
    body("imageURL").isURL({}),
  ],
  async (req, res) => {
    try {
      const { userStatus } = req;
      if (!userStatus.loggedIn) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Please login first to create a new blog",
        });
      }
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Please provide correct values to create a new blog",
        });
      }
      const { title, content, imageURL } = req.body;
      const blogCheck = await Blog.findOne({ title: title });
      if (blogCheck) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Blog with this title already exist",
        });
      }
      await Blog.create({
        title: title,
        content: content,
        coverImageURL: imageURL,
        author: userStatus.userId,
      });
      res.status(200).json({
        resStatus: true,
        message: "Blog created successfully",
      });
    } catch (error) {
      res.status(500).json({
        resStatus: false,
        error: "Server error found",
        message: error.message,
      });
    }
  },
);

router.get("/", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!userStatus.loggedIn) {
      return res.status(400).json({
        resStatus: false,
        error: "Invalid request",
        message: "Please login first to get all of your blogs",
      });
    }
    const allBlogs = await Blog.find({ author: userStatus.userId }).populate(
      "author",
      ["-_id", "username"],
      "user",
    );
    res.status(200).json({
      resStatus: true,
      myBlogs: allBlogs,
    });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const allBlogs = await Blog.find().populate(
      "author",
      ["-_id", "username"],
      "user",
    );
    res.status(200).json({
      resStatus: true,
      allBlogs,
    });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message,
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
        message: "Please login first to delete all of your blogs",
      });
    }
    await Blog.deleteMany({ author: userStatus.userId });
    res.status(200).json({
      resStatus: true,
      message: "All of your blogs deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message,
    });
  }
});

router.get("/:blogId", [param("blogId").isMongoId()], async (req, res) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        resStatus: false,
        error: "Invalid request",
        message: "Please provide correct values to get a blog",
      });
    }
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId).populate(
      "author",
      ["-_id", "username"],
      "user",
    );
    if (!blog) {
      return res.status(400).json({
        resStatus: false,
        error: "Invalid request",
        message: "Blog with this id does not exist",
      });
    }
    res.status(200).json({
      resStatus: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message,
    });
  }
});

router.put(
  "/:blogId",
  [
    param("blogId").isMongoId(),
    body("title")
      .matches(/^[a-bA-b ]/)
      .isLength({ min: 15, max: 100 })
      .optional(),
    body("content")
      .matches(/^[A-Za-z0-9 .,!?'"()\-_:;@#&*/\\\[\]{}<>|+=~`%^$]/)
      .isLength({ min: 300, max: 10000 })
      .optional(),
    body("imageURL").isURL({}).optional(),
  ],
  async (req, res) => {
    try {
      const { userStatus } = req;
      if (!userStatus.loggedIn) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Please login first to update a blog",
        });
      }
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Please provide correct values to update a blog",
        });
      }
      const { blogId } = req.params;
      const blog = await Blog.findById(blogId);
      if (!blog) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Blog with this id does not exist",
        });
      }
      if (blog.author.toString() !== userStatus.userId) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "You are not authorized to update this blog",
        });
      }
      if (!req.body) {
        return res.status(200).json({
          resStatus: true,
          message: "Blog updated successfully",
        });
      }
      if (Object.hasOwn(req.body, "title")) {
        const blogCheck = await Blog.findOne({ title: req.body.title });
        if (blogCheck && blogCheck._id.toString() !== blogId) {
          return res.status(400).json({
            resStatus: false,
            error: "Invalid request",
            message: "Blog with this title already exist",
          });
        }
        blog.title = req.body.title;
      }
      if (Object.hasOwn(req.body, "content")) {
        blog.content = req.body.content;
      }
      if (Object.hasOwn(req.body, "imageURL")) {
        blog.coverImageURL = req.body.imageURL;
      }
      await blog.save();
      res.status(200).json({
        resStatus: true,
        message: "Blog updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        resStatus: false,
        error: "Server error found",
        message: error.message,
      });
    }
  },
);

router.delete("/:blogId", [param("blogId").isMongoId()], async (req, res) => {
  try {
    const { userStatus } = req;
    if (!userStatus.loggedIn) {
      return res.status(400).json({
        resStatus: false,
        error: "Invalid request",
        message: "Please login first to delete a blog",
      });
    }
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        resStatus: false,
        error: "Invalid request",
        message: "Please provide correct values to delete a blog",
      });
    }
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(400).json({
        resStatus: false,
        error: "Invalid request",
        message: "Blog with this id does not exist",
      });
    }
    if (blog.author.toString() !== userStatus.userId) {
      return res.status(400).json({
        resStatus: false,
        error: "Invalid request",
        message: "You are not authorized to delete this blog",
      });
    }
    await Blog.findByIdAndDelete(blogId);
    res.status(200).json({
      resStatus: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message,
    });
  }
});

export default router;
