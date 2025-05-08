/* eslint-disable no-undef */
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const jwtSecret = process.env.JWT_SECRET;

export default async function verifyLogin(req, res, next) {
  try {
    const { cookies } = req;
    req.userStatus = {};
    const blogpress_auth_token = cookies["blogpress_auth_token"];
    if (!blogpress_auth_token) {
      req.userStatus.loggedIn = false;
      return next();
    }
    jwt.verify(blogpress_auth_token, jwtSecret, async (err, decodedToken) => {
      if (err) {
        req.userStatus.loggedIn = false;
        return next();
      }
      const { userId } = decodedToken;
      const userExist = await User.findById(userId);
      if (!(userExist && userExist.accountVerified)) {
        req.userStatus.loggedIn = false;
        return next();
      }
      req.userStatus.loggedIn = true;
      req.userStatus.userId = userId;
      req.userStatus.username = userExist.username;
      next();
    });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message,
    });
  }
}
