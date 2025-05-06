import { Router } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import User from "../../models/User.js";
import genOTP from "../../utils/genOTP.js";
import mailTransporter from "../../utils/mailTransporter.js";

const router = Router();

router.post(
  "/",
  [
    body("firstName").matches(/^[a-z]{3,17}/),
    body("lastName").matches(/^[a-z]{3,17}/),
    body("username").matches(/^[a-z0-9]{6,18}/),
    body("accountEmail").isEmail(),
    body("password")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 3,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 1,
      })
      .isLength({ max: 18 }),
    body("publicEmail").isEmail(),
    body("birthdate").isISO8601({ strictSeparator: true }),
    body("gender").isIn(["male", "female"]),
    body("country").isIn([
      "Afghanistan",
      "Iraq",
      "Libya",
      "Pakistan",
      "Palestine",
      "Qatar",
      "Syria",
      "Turkey",
      "Yemen",
    ]),
    body("city").isString({ min: 3, max: 30 }),
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
      const {
        firstName,
        lastName,
        username,
        accountEmail,
        password,
        publicEmail,
        birthdate,
        gender,
        country,
        city,
      } = req.body;
      const usernameExist = await User.findOne({ username: username });
      const emailExist = await User.findOne({ accountEmail: accountEmail });
      if (usernameExist && emailExist) {
        return res.status(400).json({
          resStatus: false,
          message: "Invalid request",
          error: "User with these username and email already registered",
        });
      } else if (usernameExist || emailExist) {
        return res.status(400).json({
          resStatus: false,
          message: "Invalid request",
          error: `User with this ${emailExist ? "email" : "username"} already registered`,
        });
      }
      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const newUser = await User.create({
        firstName: firstName,
        lastName: lastName,
        username: username,
        accountEmail: accountEmail,
        password: hashedPassword,
        publicEmail: publicEmail,
        birthdate: birthdate,
        gender: gender,
        address: { country: country, city: city },
      });
      const generatedOTP = await genOTP(newUser.id);
      const htmlMessage = `<h2>OTP</h2><h3>${generatedOTP}</h3>`;
      mailTransporter.sendMail(
        {
          to: newUser.accountEmail,
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
    } catch (error) {
      res.status(500).json({
        resStatus: false,
        message: "Server error found",
        error: error.message,
      });
    }
  },
);

export default router;
