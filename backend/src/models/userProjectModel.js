const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const UserProject = sequelize.define(
  "UserProject",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    UserId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    ProjectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Projects",
        key: "id",
      },
    },
    role: {
      type: DataTypes.ENUM("owner", "member", "viewer"),
      defaultValue: "member",
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["UserId", "ProjectId"],
      },
    ],
  }
);

module.exports = UserProject;
