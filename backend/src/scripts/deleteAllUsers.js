const { User, Task, Project, UserProject } = require("../models");
const { sequelize, testConnection } = require("../config/database");

async function deleteAllData() {
  try {
    // Test database connection
    await testConnection();

    console.log("Starting database cleanup...");

    // Delete data in the correct order to respect foreign key constraints
    console.log("Deleting tasks...");
    await Task.destroy({ where: {}, force: true });

    console.log("Deleting user-project relationships...");
    await UserProject.destroy({ where: {}, force: true });

    console.log("Deleting projects...");
    await Project.destroy({ where: {}, force: true });

    console.log("Deleting users...");
    await User.destroy({ where: {}, force: true });

    console.log("All data successfully deleted!");

    // Close database connection
    await sequelize.close();

    console.log("Database connection closed");
  } catch (error) {
    console.error("Error deleting data:", error);
  }
}

// Run the function
deleteAllData();
