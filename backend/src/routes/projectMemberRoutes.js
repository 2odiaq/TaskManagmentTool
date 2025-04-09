const express = require("express");
const router = express.Router();
const projectMemberController = require("../controllers/projectMemberController");
const { protect } = require("../middlewares/authMiddleware");
const projectMemberMiddleware = require("../middlewares/projectMemberMiddleware");

// Apply auth middleware to all routes
router.use(protect);

// Get all members of a project
router.get(
  "/projects/:projectId/members",
  projectMemberMiddleware.checkProjectAccess,
  projectMemberController.getProjectMembers
);

// Invite a new member to the project
router.post(
  "/projects/:projectId/members",
  projectMemberMiddleware.checkProjectAccess,
  projectMemberMiddleware.checkPermission("canManageMembers"),
  projectMemberController.inviteMember
);

// Update member settings
router.put(
  "/projects/:projectId/members/:userId/settings",
  projectMemberMiddleware.checkProjectAccess,
  projectMemberMiddleware.checkSelfOrPermission("canManageMembers"),
  projectMemberController.updateMemberSettings
);

// Remove member from project
router.delete(
  "/projects/:projectId/members/:userId",
  projectMemberMiddleware.checkProjectAccess,
  projectMemberMiddleware.checkPermission("canManageMembers"),
  projectMemberController.removeMember
);

// Get member's permissions
router.get(
  "/projects/:projectId/members/:userId/permissions",
  projectMemberMiddleware.checkProjectAccess,
  projectMemberController.getMemberPermissions
);

module.exports = router;
