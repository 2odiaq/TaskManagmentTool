const { ProjectMember, ProjectRole } = require("../models");

// Check if user has access to the project
const checkProjectAccess = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const member = await ProjectMember.findOne({
      where: { projectId, userId },
      include: [
        {
          model: ProjectRole,
          attributes: ["permissions"],
        },
      ],
    });

    if (!member) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Attach member and permissions to request
    req.projectMember = member;
    req.projectPermissions = member.ProjectRole.permissions;

    next();
  } catch (error) {
    console.error("Error checking project access:", error);
    res.status(500).json({ error: "Failed to check project access" });
  }
};

// Check if user has specific permission
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.projectPermissions[permission]) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

// Check if user is accessing their own data or has specific permission
const checkSelfOrPermission = (permission) => {
  return (req, res, next) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId || req.projectPermissions[permission]) {
      return next();
    }

    res.status(403).json({ error: "Insufficient permissions" });
  };
};

// Check if user can manage tasks
const checkTaskManagement = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const member = await ProjectMember.findOne({
      where: { projectId, userId },
      include: [
        {
          model: ProjectRole,
          attributes: ["permissions"],
        },
      ],
    });

    if (!member || !member.ProjectRole.permissions.canManageTasks) {
      return res
        .status(403)
        .json({ error: "Insufficient permissions to manage tasks" });
    }

    next();
  } catch (error) {
    console.error("Error checking task management permission:", error);
    res
      .status(500)
      .json({ error: "Failed to check task management permission" });
  }
};

// Check if user can view tasks
const checkTaskView = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    const member = await ProjectMember.findOne({
      where: { projectId, userId },
      include: [
        {
          model: ProjectRole,
          attributes: ["permissions"],
        },
      ],
    });

    if (!member || !member.ProjectRole.permissions.canViewTasks) {
      return res
        .status(403)
        .json({ error: "Insufficient permissions to view tasks" });
    }

    next();
  } catch (error) {
    console.error("Error checking task view permission:", error);
    res.status(500).json({ error: "Failed to check task view permission" });
  }
};

module.exports = {
  checkProjectAccess,
  checkPermission,
  checkSelfOrPermission,
  checkTaskManagement,
  checkTaskView,
};
