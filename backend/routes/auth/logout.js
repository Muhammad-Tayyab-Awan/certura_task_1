import { Router } from "express";

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
    res.clearCookie("blogpress_auth_token");
    res.status(200).json({
      resStatus: true,
      message: "Logged out successfully",
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
