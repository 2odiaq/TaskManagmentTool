const { User } = require("../models");

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} - Response with users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "username"],
      order: [["username", "ASC"]],
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
};
