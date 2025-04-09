const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { protect, restrictToAdmin } = require("../middlewares/authMiddleware");

// All routes are protected
router.use(protect);

// CRUD operations for projects
router
  .route("/")
  .get(projectController.getAllProjects)
  .post(projectController.createProject);

router
  .route("/:id")
  .get(projectController.getProjectById)
  .put(projectController.updateProject)
  .delete(restrictToAdmin, projectController.deleteProject);

// Project user management
router.post("/users", projectController.addUserToProject);
router.delete(
  "/:projectId/users/:userId",
  projectController.removeUserFromProject
);

module.exports = router;
