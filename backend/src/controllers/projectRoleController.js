const { ProjectRole, Project, ProjectMember } = require("../models");
const { Op } = require("sequelize");

// Default role permissions
const DEFAULT_ROLE_PERMISSIONS = {
  owner: {
    canManageProject: true,
    canManageTasks: true,
    canManageMembers: true,
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canViewTasks: true,
    canComment: true,
  },
  admin: {
    canManageProject: true,
    canManageTasks: true,
    canManageMembers: true,
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canViewTasks: true,
    canComment: true,
  },
  project_manager: {
    canManageProject: false,
    canManageTasks: true,
    canManageMembers: true,
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canViewTasks: true,
    canComment: true,
  },
  editor: {
    canManageProject: false,
    canManageTasks: false,
    canManageMembers: false,
    canCreateTasks: true,
    canEditTasks: true,
    canDeleteTasks: false,
    canViewTasks: true,
    canComment: true,
  },
  viewer: {
    canManageProject: false,
    canManageTasks: false,
    canManageMembers: false,
    canCreateTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canViewTasks: true,
    canComment: true,
  },
};

// Create default roles for a project
const createDefaultRoles = async (projectId) => {
  try {
    const roles = Object.entries(DEFAULT_ROLE_PERMISSIONS).map(
      ([role, permissions]) => ({
        projectId,
        role,
        permissions,
      })
    );

    await ProjectRole.bulkCreate(roles);
    return true;
  } catch (error) {
    console.error("Error creating default roles:", error);
    throw error;
  }
};

// Get all roles for a project
const getProjectRoles = async (req, res) => {
  try {
    const { projectId } = req.params;
    const roles = await ProjectRole.findAll({
      where: { projectId },
      include: [
        {
          model: ProjectMember,
          include: ["User"],
        },
      ],
    });

    res.json(roles);
  } catch (error) {
    console.error("Error getting project roles:", error);
    res.status(500).json({ error: "Failed to get project roles" });
  }
};

// Update role permissions
const updateRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissions } = req.body;

    const role = await ProjectRole.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }

    // Prevent modifying owner role permissions
    if (role.role === "owner") {
      return res
        .status(403)
        .json({ error: "Cannot modify owner role permissions" });
    }

    await role.update({ permissions });
    res.json(role);
  } catch (error) {
    console.error("Error updating role permissions:", error);
    res.status(500).json({ error: "Failed to update role permissions" });
  }
};

// Assign role to user
const assignRole = async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const { roleId } = req.body;

    // Check if user is already a member
    const existingMember = await ProjectMember.findOne({
      where: { projectId, userId },
    });

    if (existingMember) {
      await existingMember.update({ roleId });
    } else {
      await ProjectMember.create({
        projectId,
        userId,
        roleId,
      });
    }

    res.json({ message: "Role assigned successfully" });
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).json({ error: "Failed to assign role" });
  }
};

// Remove role from user
const removeRole = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const member = await ProjectMember.findOne({
      where: { projectId, userId },
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Prevent removing the last owner
    const role = await ProjectRole.findByPk(member.roleId);
    if (role.role === "owner") {
      const ownerCount = await ProjectMember.count({
        where: {
          projectId,
          roleId: role.id,
        },
      });

      if (ownerCount <= 1) {
        return res.status(403).json({ error: "Cannot remove the last owner" });
      }
    }

    await member.destroy();
    res.json({ message: "Role removed successfully" });
  } catch (error) {
    console.error("Error removing role:", error);
    res.status(500).json({ error: "Failed to remove role" });
  }
};

module.exports = {
  createDefaultRoles,
  getProjectRoles,
  updateRolePermissions,
  assignRole,
  removeRole,
};
