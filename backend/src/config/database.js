const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// Get database config from environment variables
const dbName = process.env.DB_NAME || "taskmaster";

// Create a new Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../../database.sqlite"),
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // Handle connection timeouts and retries
  retry: {
    max: 3,
    timeout: 30000,
  },
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    return false;
  }
};

module.exports = { sequelize, testConnection };
