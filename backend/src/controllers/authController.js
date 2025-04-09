const jwt = require("jsonwebtoken");
const { User } = require("../models");

// Helper function to handle Sequelize validation errors
const handleValidationError = (err) => {
  // Check if it's a Sequelize validation error
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    // Extract error messages from validation errors
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));

    return {
      status: 400,
      message: "Validation failed",
      errors,
    };
  }

  // Default error response
  return {
    status: 500,
    message: err.message || "Internal server error",
  };
};

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Validation failed",
        errors: [
          ...(!email ? [{ field: "email", message: "Email is required" }] : []),
          ...(!password
            ? [{ field: "password", message: "Password is required" }]
            : []),
        ],
      });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const userExists = await User.findOne({
      where: { email: normalizedEmail },
    });
    if (userExists) {
      return res.status(400).json({
        message: "Validation failed",
        errors: [
          { field: "email", message: "User with this email already exists" },
        ],
      });
    }

    // Check if username is taken
    if (username) {
      const normalizedUsername = username
        .trim()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "_");
      const usernameExists = await User.findOne({
        where: { username: normalizedUsername },
      });
      if (usernameExists) {
        return res.status(400).json({
          message: "Validation failed",
          errors: [{ field: "username", message: "Username is already taken" }],
        });
      }
    }

    // Create new user with normalized data
    const user = await User.create({
      email: normalizedEmail,
      password,
      username: username || undefined,
    });

    // Create and send token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      userId: user.id,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle different types of errors
    const errorResponse = handleValidationError(error);

    res.status(errorResponse.status).json({
      message: errorResponse.message,
      errors: errorResponse.errors,
    });
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    console.log("Login attempt received:", { email: req.body.email });

    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      console.log("Login validation failed - missing email or password");
      return res.status(400).json({
        message: "Validation failed",
        errors: [
          ...(!email ? [{ field: "email", message: "Email is required" }] : []),
          ...(!password
            ? [{ field: "password", message: "Password is required" }]
            : []),
        ],
      });
    }

    // Normalize email to lowercase for consistent lookup
    const normalizedEmail = email.toLowerCase().trim();
    console.log("Looking up user with email:", normalizedEmail);

    // Find user
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      console.log("User not found with email:", normalizedEmail);
      return res.status(401).json({
        message: "Authentication failed",
        errors: [{ field: "email", message: "Invalid credentials" }],
      });
    }

    console.log("User found, checking password");

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Password does not match for user:", normalizedEmail);
      return res.status(401).json({
        message: "Authentication failed",
        errors: [{ field: "password", message: "Invalid credentials" }],
      });
    }

    console.log("Password matched, generating token");

    // Create and send token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1d" }
    );

    console.log("Login successful for:", normalizedEmail);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    // Handle different types of errors
    const errorResponse = handleValidationError(error);

    res.status(errorResponse.status).json({
      message: errorResponse.message,
      errors: errorResponse.errors,
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get current user error:", error);
    next(error);
  }
};

// Logout user - client side token removal
exports.logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};
