const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ProjectRole = sequelize.define(
  "ProjectRole",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
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
    permissions: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Projects",
        key: "id",
      },
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ProjectRole;