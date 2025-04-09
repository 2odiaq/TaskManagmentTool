const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Milestone = sequelize.define(
  "Milestone",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("planned", "in_progress", "completed", "delayed"),
      defaultValue: "planned",
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Projects",
        key: "id",
      },
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Milestone;
