import express from "express";
import {
  register,
  login,
  verifyEmail,
  resendVerificationCode,
  getMe,
  updateMyProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-code", resendVerificationCode);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateMyProfile);

export default router;
