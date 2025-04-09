const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("todo", "in_progress", "review", "done"),
      defaultValue: "todo",
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high", "urgent"),
      defaultValue: "medium",
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    estimatedHours: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    actualHours: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    labels: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    customFields: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    dependencyData: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    milestoneId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Milestones",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Task;
