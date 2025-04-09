const express = require("express");
const router = express.Router();
const projectRoleController = require("../controllers/projectRoleController");
const { protect } = require("../middlewares/authMiddleware");
const projectMemberMiddleware = require("../middlewares/projectMemberMiddleware");

// Apply auth middleware to all routes
router.use(protect);

// Get all roles for a project
router.get(
  "/projects/:projectId/roles",
  projectMemberMiddleware.checkProjectAccess,
  projectRoleController.getProjectRoles
);

// Update role permissions
router.put(
  "/roles/:roleId",
  projectMemberMiddleware.checkProjectAccess,
  projectMemberMiddleware.checkPermission("canManageProject"),
  projectRoleController.updateRolePermissions
);

// Assign role to user
router.post(
  "/projects/:projectId/users/:userId/role",
  projectMemberMiddleware.checkProjectAccess,
  projectMemberMiddleware.checkPermission("canManageMembers"),
  projectRoleController.assignRole
);

// Remove role from user
router.delete(
  "/projects/:projectId/users/:userId/role",
  projectMemberMiddleware.checkProjectAccess,
  projectMemberMiddleware.checkPermission("canManageMembers"),
  projectRoleController.removeRole
);

module.exports = router;
