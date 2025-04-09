const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./config/database");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const milestoneRoutes = require("./routes/milestoneRoutes");
const commentRoutes = require("./routes/commentRoutes");

// Initialize express app
const app = express();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost:3000") || origin.startsWith("http://localhost:3001")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
    preflightContinue: false
  })
);

// Handle OPTIONS requests
app.options("*", (req, res) => {
  res.sendStatus(204);
});

app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/milestones", milestoneRoutes);
app.use("/api/v1/comments", commentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Handle Sequelize validation errors
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation Error",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Handle Sequelize unique constraint errors
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      status: "error",
      message: "Duplicate Entry",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }

  // Handle JWT expiration
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      message: "Token expired",
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

// Define PORT
const PORT = parseInt(process.env.PORT, 10) || 5002;

// Function to initialize database
const initializeDatabase = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("Database connection established successfully");

    // Sync database models
    await sequelize.sync({ alter: true });
    console.log("Database models synchronized successfully");

    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    return false;
  }
};

// Function to find an available port
const findAvailablePort = async (startPort) => {
  // Ensure startPort is a number and within valid range
  startPort = parseInt(startPort, 10);
  if (isNaN(startPort) || startPort < 1024 || startPort > 65535) {
    startPort = 5002; // Default to 5002 if invalid
  }
  
  const net = require("net");
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", () => {
      // Increment port and check if it's still valid
      const nextPort = startPort + 1;
      if (nextPort > 65535) {
        // If we've exceeded valid port range, start over from base port
        resolve(findAvailablePort(5002));
      } else {
        server.close(() => {
          resolve(findAvailablePort(nextPort));
        });
      }
    });
    server.listen(startPort, () => {
      const { port } = server.address();
      server.close(() => {
        resolve(port);
      });
    });
  });
};

// Start the server
const startServer = async () => {
  try {
    // Initialize database
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      throw new Error("Database initialization failed");
    }

    // Find an available port
    const port = await findAvailablePort(PORT);

    // Start server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the application
startServer();
