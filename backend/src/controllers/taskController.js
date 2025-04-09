const { Task, User, Project } = require("../models");

// Get all tasks with filtering options
exports.getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, assignedTo, projectId } = req.query;
    const whereClause = {};

    // Add filters if provided
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (assignedTo) whereClause.assignedTo = assignedTo;
    if (projectId) whereClause.projectId = projectId;

    // For regular users, only show tasks created by them or assigned to them
    if (req.user.role !== "admin") {
      whereClause[Symbol.for("or")] = [
        { createdBy: req.user.id },
        { assignedTo: req.user.id },
      ];
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        { model: User, as: "creator", attributes: ["id", "email", "username"] },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "email", "username"],
        },
        { model: Project },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

// Get single task by ID
exports.getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "email", "username"] },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "email", "username"],
        },
        { model: Project },
      ],
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if user has permission to view this task
    if (
      req.user.role !== "admin" &&
      task.createdBy !== req.user.id &&
      task.assignedTo !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this task" });
    }

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    let { title, description, projectId, priority, assignedTo, dueDate } =
      req.body;

    // Convert empty strings to null for UUID fields
    projectId = projectId === "" ? null : projectId;
    assignedTo = assignedTo === "" ? null : assignedTo;

    // Handle invalid date values
    if (dueDate) {
      const parsedDate = new Date(dueDate);
      dueDate = isNaN(parsedDate.getTime()) ? null : parsedDate;
    } else {
      dueDate = null;
    }

    // Check if project exists
    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
    }

    // Check if assignee exists
    if (assignedTo) {
      const assignee = await User.findByPk(assignedTo);
      if (!assignee) {
        return res.status(404).json({ message: "Assigned user not found" });
      }
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      priority,
      projectId,
      assignedTo,
      dueDate,
      createdBy: req.user.id,
    });

    // Fetch the complete task with associations
    const createdTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "email", "username"] },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "email", "username"],
        },
        { model: Project },
      ],
    });

    res.status(201).json({ task: createdTask });
  } catch (error) {
    console.error("Task creation error:", error);
    next(error);
  }
};

// Update a task
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    let {
      title,
      description,
      status,
      priority,
      projectId,
      assignedTo,
      dueDate,
    } = req.body;

    // Convert empty strings to null for UUID fields
    projectId = projectId === "" ? null : projectId;
    assignedTo = assignedTo === "" ? null : assignedTo;

    // Handle invalid date values
    if (dueDate) {
      const parsedDate = new Date(dueDate);
      dueDate = isNaN(parsedDate.getTime()) ? null : parsedDate;
    } else {
      dueDate = null;
    }

    // Find task
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check permission
    if (req.user.role !== "admin" && task.createdBy !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    // Update task
    await task.update({
      title,
      description,
      status,
      priority,
      projectId,
      assignedTo,
      dueDate,
    });

    // Fetch updated task with associations
    const updatedTask = await Task.findByPk(id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "email", "username"] },
        {
          model: User,
          as: "assignee",
          attributes: ["id", "email", "username"],
        },
        { model: Project },
      ],
    });

    res.status(200).json({ task: updatedTask });
  } catch (error) {
    console.error("Task update error:", error);
    next(error);
  }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find task
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check permission
    if (req.user.role !== "admin" && task.createdBy !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    // Delete task
    await task.destroy();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
