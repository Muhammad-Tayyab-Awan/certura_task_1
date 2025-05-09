import { Router } from "express";
import OTP from "../../models/OTP.js";
import User from "../../models/User.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { userStatus } = req;
    if (!userStatus.loggedIn) {
      return res.status(400).json({
        resStatus: false,
        error: "Invalid request",
        message: "You are not logged in",
      });
    }
    await OTP.deleteMany({ userId: userStatus.userId });
    await User.findByIdAndDelete(userStatus.userId);
    res.clearCookie("blogpress_auth_token");
    res
      .status(200)
      .json({ resStatus: true, message: "Your account deleted successfully" });
  } catch (error) {
    res.status(500).json({
      resStatus: false,
      error: "Server error found",
      message: error.message,
    });
  }
});

export default router;
