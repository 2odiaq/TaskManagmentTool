const { ProjectMember, User, Project, ProjectRole } = require("../models");
const { Op } = require("sequelize");

// Get all members of a project
const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const members = await ProjectMember.findAll({
      where: { projectId },
      include: [
        {
          model: User,
          attributes: ["id", "email", "username"],
        },
        {
          model: ProjectRole,
          attributes: ["id", "role", "permissions"],
        },
      ],
    });

    res.json(members);
  } catch (error) {
    console.error("Error getting project members:", error);
    res.status(500).json({ error: "Failed to get project members" });
  }
};

// Invite a new member to the project
const inviteMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email, roleId } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user is already a member
    const existingMember = await ProjectMember.findOne({
      where: { projectId, userId: user.id },
    });

    if (existingMember) {
      return res
        .status(400)
        .json({ error: "User is already a member of this project" });
    }

    // Create new member
    const member = await ProjectMember.create({
      projectId,
      userId: user.id,
      roleId,
    });

    res.status(201).json(member);
  } catch (error) {
    console.error("Error inviting member:", error);
    res.status(500).json({ error: "Failed to invite member" });
  }
};

// Update member settings
const updateMemberSettings = async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const { notificationSettings } = req.body;

    const member = await ProjectMember.findOne({
      where: { projectId, userId },
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    await member.update({ notificationSettings });
    res.json(member);
  } catch (error) {
    console.error("Error updating member settings:", error);
    res.status(500).json({ error: "Failed to update member settings" });
  }
};

// Remove member from project
const removeMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const member = await ProjectMember.findOne({
      where: { projectId, userId },
      include: [
        {
          model: ProjectRole,
          attributes: ["role"],
        },
      ],
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // Prevent removing the last owner
    if (member.ProjectRole.role === "owner") {
      const ownerCount = await ProjectMember.count({
        where: {
          projectId,
          roleId: member.roleId,
        },
      });

      if (ownerCount <= 1) {
        return res.status(403).json({ error: "Cannot remove the last owner" });
      }
    }

    await member.destroy();
    res.json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ error: "Failed to remove member" });
  }
};

// Get member's permissions
const getMemberPermissions = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

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
      return res.status(404).json({ error: "Member not found" });
    }

    res.json(member.ProjectRole.permissions);
  } catch (error) {
    console.error("Error getting member permissions:", error);
    res.status(500).json({ error: "Failed to get member permissions" });
  }
};

module.exports = {
  getProjectMembers,
  inviteMember,
  updateMemberSettings,
  removeMember,
  getMemberPermissions,
};
