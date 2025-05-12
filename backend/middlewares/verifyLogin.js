/* eslint-disable no-undef */
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const jwtSecret = process.env.JWT_SECRET;

export default async function verifyLogin(req, res, next) {
  try {
    const { cookies } = req;
    req.userStatus = {};
    const auth_token = cookies["certurat1_auth_token"];
    if (!auth_token) {
      req.userStatus.loggedIn = false;
      next();
    }
    jwt.verify(auth_token, jwtSecret, async (err, decoded) => {
      if (err) {
        req.userStatus.loggedIn = false;
        next();
      } else {
        const user = await User.findById(decoded.userId);
        if (!user) {
          req.userStatus.loggedIn = false;
          next();
        } else {
          req.userStatus.loggedIn = true;
          req.userStatus.userId = user.id;
          next();
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message
    });
  }
}
