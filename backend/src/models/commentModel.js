const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    taskId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Tasks",
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
    parentCommentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Comments",
        key: "id",
      },
    },
    mentions: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Comment;
