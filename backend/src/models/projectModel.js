const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("planned", "in_progress", "on_hold", "completed"),
      defaultValue: "planned",
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    visibility: {
      type: DataTypes.ENUM("private", "team", "public"),
      defaultValue: "team",
    },
    objectives: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    parentProjectId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Projects",
        key: "id",
      },
    },
    isTemplate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    customFields: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    settings: {
      type: DataTypes.JSON,
      defaultValue: {
        allowFileAttachments: true,
        allowComments: true,
        allowTaskDependencies: true,
        defaultView: "list", // list, kanban, gantt
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Project;
