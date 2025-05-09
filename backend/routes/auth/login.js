/* eslint-disable no-undef */
import { Router } from "express";
import { body, validationResult } from "express-validator";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../../models/User.js";
import OTP from "../../models/OTP.js";
import genOTP from "../../utils/genOTP.js";
import mailTransporter from "../../utils/mailTransporter.js";

const router = Router();
const jwtSecret = process.env.JWT_SECRET;

router.post(
  "/",
  [
    body("username").notEmpty(),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 3,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 1,
      })
      .isLength({ max: 18 }),
  ],
  async (req, res) => {
    try {
      const { userStatus } = req;
      if (userStatus.loggedIn) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "You are already logged in",
        });
      }
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({
          resStatus: false,
          message: "Invalid request",
          error: "You provided invalid values",
        });
      }
      const { username, password } = req.body;
      if (
        !validator.isEmail(username) ||
        !validator.matches(username, /^[a-z0-9]{6,18}/)
      ) {
        return res.status(400).json({
          resStatus: false,
          message: "Invalid request",
          error: "You provided invalid values",
        });
      }
      const userExist = validator.isEmail(username)
        ? await User.findOne({ accountEmail: username })
        : await User.findOne({ username: username });
      if (!userExist) {
        return res.status(404).json({
          resStatus: false,
          message: "Invalid request",
          error: "User not found",
        });
      }
      const isPassCorrect = bcrypt.compareSync(password, userExist.password);
      if (!isPassCorrect) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Please provide correct credentials",
        });
      }
      if (!userExist.accountVerified) {
        await OTP.deleteMany({ userId: userExist.id });
        const generatedOTP = await genOTP(userExist.id);
        const htmlMessage = `<h2>OTP</h2><h3>${generatedOTP}</h3>`;
        mailTransporter.sendMail(
          {
            to: userExist.accountEmail,
            subject: "OTP for BlogPress",
            html: htmlMessage,
          },
          (err) => {
            if (err) {
              return res.status(500).json({
                resStatus: false,
                message: "Server error found",
                error: err.message,
              });
            }
            return res.status(200).json({
              resStatus: true,
              message:
                "We have sent you a verification OTP please check your mailbox",
            });
          },
        );
      } else {
        const authToken = jwt.sign({ userId: userExist.id }, jwtSecret);
        res.cookie("blogpress_auth_token", authToken, { maxAge: 3.154e10 });
        res
          .status(200)
          .json({ resStatus: true, message: "You are successfully logged in" });
      }
    } catch (error) {
      res.status(500).json({
        resStatus: false,
        error: "Server error found",
        message: error.message,
      });
    }
  },
);

export default router;
