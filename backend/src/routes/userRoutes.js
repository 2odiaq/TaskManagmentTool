const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

// Get all users
router.get("/", protect, userController.getAllUsers);

module.exports = router;
