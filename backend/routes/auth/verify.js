/* eslint-disable no-undef */
import { Router } from "express";
import { param, validationResult } from "express-validator";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import User from "../../models/User.js";
import OTP from "../../models/OTP.js";

const router = Router();
const jwtSecret = process.env.JWT_SECRET;

router.get(
  "/account-verification-otp/:username/:otpCode",
  [
    param("username").notEmpty(),
    param("otpCode").isNumeric().isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        let invalidFields = result.errors.map((error) => error.path);
        invalidFields = invalidFields.filter((invalidField, idx) => {
          return (
            invalidFields.findIndex((value) => value === invalidField) === idx
          );
        });
        const totalInvalidFields = invalidFields.length;
        return res.status(400).json({
          resStatus: false,
          message: "Invalid request",
          error: `You provided invalid value${totalInvalidFields > 1 ? "s" : ""} for ${totalInvalidFields > 1 ? "these fields" : "this field"} ${invalidFields.toString().replaceAll(",", ", ")}`,
        });
      }
      const { username, otpCode } = req.params;
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
      const user = validator.isEmail(username)
        ? await User.findOne({ accountEmail: username })
        : await User.findOne({ username: username });
      if (!user || user.accountVerified) {
        return res.status(400).json({
          resStatus: false,
          message: "Invalid request",
          error: "Invalid otp verification request",
        });
      }
      const otpDoc = await OTP.findOne({ userId: user.id });
      if (otpDoc.status !== "pending") {
        return res.status(400).json({
          resStatus: false,
          message: "Invalid request",
          error: "Invalid verification otp",
        });
      }
      const otp = bcrypt.compareSync(otpCode, otpDoc.otpCode);
      if (!(otp && Date.now() <= otpDoc.expiresAt)) {
        otpDoc.status = "expired";
        await otpDoc.save();
        return res.status(400).json({
          resStatus: false,
          message: "Invalid request",
          error: "Invalid verification otp",
        });
      }
      otpDoc.status = "verified";
      user.accountVerified = true;
      await otpDoc.save();
      await user.save();
      const authToken = jwt.sign({ userId: user.id }, jwtSecret);
      res.cookie("blogpress_auth_token", authToken, { maxAge: 3.154e10 });
      return res.status(200).json({
        resStatus: true,
        message: "Your account verified successfully",
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

export default router;
