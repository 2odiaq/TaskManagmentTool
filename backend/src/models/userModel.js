const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "users_email_unique",
        msg: "Email already in use",
      },
      validate: {
        isEmail: {
          msg: "Please enter a valid email address",
        },
        notNull: {
          msg: "Email is required",
        },
        notEmpty: {
          msg: "Email cannot be empty",
        },
        len: {
          args: [3, 255],
          msg: "Email must be between 3 and 255 characters",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password is required",
        },
        notEmpty: {
          msg: "Password cannot be empty",
        },
        len: {
          args: [6, 100],
          msg: "Password must be at least 6 characters",
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: {
        name: "users_username_unique",
        msg: "Username already in use",
      },
      validate: {
        len: {
          args: [3, 50],
          msg: "Username must be between 3 and 50 characters",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeValidate: (user) => {
        // Normalize email to lowercase
        if (user.email) {
          user.email = user.email.toLowerCase().trim();
        }

        // If username is not provided, use email prefix
        if (!user.username && user.email) {
          const emailPrefix = user.email.split("@")[0];
          user.username = emailPrefix;
        }

        // Ensure username doesn't have spaces or special characters
        if (user.username) {
          user.username = user.username
            .trim()
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "_");
        }
      },
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

// Instance method to compare passwords
User.prototype.comparePassword = async function (candidatePassword) {
  if (!candidatePassword) {
    console.log("Password comparison failed: No candidate password provided");
    return false;
  }

  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log("Password comparison result:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

module.exports = User;
