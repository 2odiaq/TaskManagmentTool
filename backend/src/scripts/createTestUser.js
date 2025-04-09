const { User } = require("../models");
const { sequelize, testConnection } = require("../config/database");

async function createTestUser() {
  try {
    // Test database connection
    await testConnection();

    console.log("Creating test user...");

    // Create a test user with known credentials
    const testUser = await User.create({
      email: "test@example.com",
      password: "password123",
      username: "testuser",
    });

    console.log("Test user created successfully:", {
      id: testUser.id,
      email: testUser.email,
      username: testUser.username,
    });

    // Close database connection
    await sequelize.close();

    console.log("Database connection closed");
  } catch (error) {
    console.error("Error creating test user:", error);
  }
}

// Run the function
createTestUser();
