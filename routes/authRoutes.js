const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

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

// Google OAuth
// Google signup + login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Callback route for Google OAuth
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${token}`);
  },
);

module.exports = router;
