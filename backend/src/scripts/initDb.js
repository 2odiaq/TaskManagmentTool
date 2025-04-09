/**
 * Database initialization script
 *
 * This script initializes the database by:
 * 1. Testing the connection
 * 2. Dropping all tables if requested
 * 3. Creating tables based on defined models
 */

const { sequelize, testConnection } = require("../config/database");
const models = require("../models");

// Function to initialize database
const initDb = async (forceSync = false) => {
  try {
    console.log("Testing database connection...");
    await testConnection();

    console.log("Syncing database models...");
    const syncOptions = {
      force: forceSync, // Set to true to drop and recreate tables
      alter: !forceSync, // Use alter when not forcing
    };

    await sequelize.sync(syncOptions);
    console.log(`Database synced successfully (force: ${forceSync})`);

    console.log("Database initialization complete");
    process.exit(0);
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
};

// Check if --force flag is provided
const args = process.argv.slice(2);
const forceSync = args.includes("--force");

if (forceSync) {
  console.log("WARNING: This will delete all data in the database!");
  console.log("Press Ctrl+C to cancel or wait 5 seconds to continue...");

  // Wait for 5 seconds before proceeding with force sync
  setTimeout(() => {
    console.log("Proceeding with force sync...");
    initDb(true);
  }, 5000);
} else {
  initDb(false);
}
