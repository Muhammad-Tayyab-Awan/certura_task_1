import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  try {
    res
      .status(200)
      .json({ resStatus: true, message: "Welcome to registration endpoint" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error Occurred on Server Side",
      message: error.message,
    });
  }
});

export default router;
