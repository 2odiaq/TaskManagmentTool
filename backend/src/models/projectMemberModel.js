const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ProjectMember = sequelize.define(
  "ProjectMember",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Projects",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "ProjectRoles",
        key: "id",
      },
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notificationSettings: {
      type: DataTypes.JSON,
      defaultValue: {
        email: true,
        inApp: true,
        taskAssigned: true,
        taskUpdated: true,
        commentMention: true,
        dueDateReminder: true,
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["projectId", "userId"],
      },
    ],
  }
);

module.exports = ProjectMember;
