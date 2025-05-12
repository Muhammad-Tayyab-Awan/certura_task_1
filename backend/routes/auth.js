/* eslint-disable no-undef */
import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Blog from "../models/Blog.js";

const router = Router();
const jwtSecret = process.env.JWT_SECRET;

router.post(
  "/signup",
  [
    body("username").matches(/^[a-z0-9]{6,18}/),
    body("password")
      .isStrongPassword({
        minLowercase: 3,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 1,
        minLength: 8
      })
      .isLength({ min: 8, max: 18 })
  ],
  async (req, res) => {
    try {
      const { userStatus } = req;
      if (userStatus.loggedIn) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Please logout first to create another account"
        });
      }
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid values",
          message: "Please provide correct values for username and password"
        });
      }
      const { username, password } = req.body;
      const userCheck = await User.findOne({ username });
      if (userCheck) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Account with that username already exist"
        });
      }
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const newUser = await User.create({ username, password: hashedPassword });
      const auth_token = jwt.sign({ userId: newUser.id }, jwtSecret);
      res.cookie("certurat1_auth_token", auth_token, { maxAge: 1.296e9 });
      res.status(200).json({
        resStatus: true,
        message: "Account created successfully"
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

router.post(
  "/login",
  [
    body("username").matches(/^[a-z0-9]{6,18}/),
    body("password")
      .isStrongPassword({
        minLowercase: 3,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 1,
        minLength: 8
      })
      .isLength({ min: 8, max: 18 })
  ],
  async (req, res) => {
    try {
      const { userStatus } = req;
      if (userStatus.loggedIn) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "You are already logged in to an account"
        });
      }
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid values",
          message: "Please provide correct values for username and password"
        });
      }
      const { username, password } = req.body;
      const userCheck = await User.findOne({ username });
      if (!userCheck) {
        return res.status(404).json({
          resStatus: false,
          error: "Invalid request",
          message: "Account not found"
        });
      }
      const passwordCheck = bcrypt.compareSync(password, userCheck.password);
      if (!passwordCheck) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Please provide correct credentials"
        });
      }
      const auth_token = jwt.sign({ userId: userCheck.id }, jwtSecret);
      res.cookie("certurat1_auth_token", auth_token, { maxAge: 1.296e9 });
      res.status(200).json({
        resStatus: true,
        message: "Welcome back you logged in successfully"
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

router.get("/logout", (req, res) => {
  try {
    const { userStatus } = req;
    if (!userStatus.loggedIn) {
      return res.status(400).json({
        resStatus: false,
        error: "Invalid request",
        message: "Please login first to logout"
      });
    }
    res.clearCookie("certurat1_auth_token");
    res.status(200).json({
      resStatus: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message
    });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!userStatus.loggedIn) {
      return res.status(400).json({
        resStatus: false,
        error: "Invalid request",
        message: "You are not logged in"
      });
    }
    await Blog.deleteMany({ author: userStatus.userId });
    await User.findByIdAndDelete(userStatus.userId);
    res.clearCookie("certurat1_auth_token");
    res.status(200).json({
      resStatus: true,
      message: "Account deleted successfully"
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
