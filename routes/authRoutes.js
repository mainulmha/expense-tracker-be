const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  verifyEmail,
  resendVerification,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (need token)
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.post("/change-password", protect, changePassword);

// Email Verification
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

// Public routes (no auth required)
// Forgot password
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
