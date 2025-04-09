const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

// Test endpoint
router.get("/test", (req, res) => {
  res.status(200).json({ message: "Auth API is working!" });
});

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Protected routes
router.get("/me", protect, authController.getCurrentUser);

module.exports = router;
