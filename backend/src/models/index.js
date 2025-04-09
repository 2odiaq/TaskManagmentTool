const User = require("./userModel");
const Task = require("./taskModel");
const Project = require("./projectModel");
const Milestone = require("./milestoneModel");
const Comment = require("./commentModel");
const ProjectRole = require("./projectRoleModel");
const ProjectMember = require("./projectMemberModel");
const UserProject = require("./userProjectModel");
const { sequelize } = require("../config/database");

// Define model relationships
// User to Task (created by) - One-to-Many
User.hasMany(Task, { foreignKey: "createdBy", as: "createdTasks" });
Task.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

// User to Task (assigned to) - One-to-Many
User.hasMany(Task, { foreignKey: "assignedTo", as: "assignedTasks" });
Task.belongsTo(User, { foreignKey: "assignedTo", as: "assignee" });

// Project to Task - One-to-Many
Project.hasMany(Task, { foreignKey: "projectId" });
Task.belongsTo(Project, { foreignKey: "projectId" });

// Project to Subprojects - Self-referential One-to-Many
Project.hasMany(Project, {
  foreignKey: "parentProjectId",
  as: "subprojects",
});
Project.belongsTo(Project, {
  foreignKey: "parentProjectId",
  as: "parentProject",
});

// Project to ProjectRole - One-to-Many
Project.hasMany(ProjectRole, { foreignKey: "projectId" });
ProjectRole.belongsTo(Project, { foreignKey: "projectId" });

// Project to ProjectMember - One-to-Many
Project.hasMany(ProjectMember, { foreignKey: "projectId" });
ProjectMember.belongsTo(Project, { foreignKey: "projectId" });

// User to ProjectMember - One-to-Many
User.hasMany(ProjectMember, { foreignKey: "userId" });
ProjectMember.belongsTo(User, { foreignKey: "userId" });

// ProjectRole to ProjectMember - One-to-Many
ProjectRole.hasMany(ProjectMember, { foreignKey: "roleId" });
ProjectMember.belongsTo(ProjectRole, { foreignKey: "roleId" });

// Project to Milestone - One-to-Many
Project.hasMany(Milestone, { foreignKey: "projectId" });
Milestone.belongsTo(Project, { foreignKey: "projectId" });

// Task to Milestone - Many-to-One
Milestone.hasMany(Task, { foreignKey: "milestoneId" });
Task.belongsTo(Milestone, { foreignKey: "milestoneId" });

// User to Comment - One-to-Many
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });

// User to Project - Many-to-Many
User.belongsToMany(Project, { through: UserProject });
Project.belongsToMany(User, { through: UserProject });

// Task Dependencies - Self-referential Many-to-Many
const TaskDependency = sequelize.define(
  "TaskDependency",
  {
    type: {
      type: sequelize.Sequelize.ENUM("blocks", "depends_on", "related_to"),
      defaultValue: "depends_on",
    },
  },
  { timestamps: true }
);

Task.belongsToMany(Task, {
  through: TaskDependency,
  as: "taskDependencies",
  foreignKey: "taskId",
});
Task.belongsToMany(Task, {
  through: TaskDependency,
  as: "dependentTasks",
  foreignKey: "dependentTaskId",
});

// Export models and relationships
module.exports = {
  User,
  Task,
  Project,
  Milestone,
  Comment,
  ProjectRole,
  ProjectMember,
  UserProject,
  TaskDependency,
  sequelize,
};
