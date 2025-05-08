/* eslint-disable no-undef */
import { Router } from "express";

import uploader from "../middlewares/uploader.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import User from "../models/User.js";

const router = Router();
const prfPicDir = process.env.CLOUDINARY_PRF_PIC_DIR;

router.post(
  "/profile-picture",
  uploader.single("prf_pic"),
  async (req, res) => {
    try {
      const { userStatus } = req;
      if (!userStatus.loggedIn) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Login first to upload your profile picture",
        });
      }
      if (!req.file) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Please upload image file",
        });
      }
      if (req.file.size > 1048576) {
        return res.status(400).json({
          resStatus: false,
          error: "Invalid request",
          message: "Please upload image of max 1 MB size or less",
        });
      }
      const user = await User.findById(userStatus.userId);
      cloudinary.v2.uploader
        .upload_stream(
          {
            folder: `${prfPicDir}/${userStatus.role}`,
            public_id: `${userStatus.userId}_${userStatus.username}`,
          },
          async (error, result) => {
            if (error) {
              return res.status(400).json({
                resStatus: false,
                error: "Server error found",
                message: "Profile picture upload failed",
              });
            }
            user.profilePhoto = result.secure_url;
            await user.save();
            res.status(200).json({
              resStatus: true,
              message: "Profile picture uploaded successfully",
            });
          },
        )
        .end(req.file.buffer);
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
