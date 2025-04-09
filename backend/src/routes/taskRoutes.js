const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");

// All routes are protected
router.use(protect);

// CRUD operations for tasks
router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTaskById)
  .put(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
