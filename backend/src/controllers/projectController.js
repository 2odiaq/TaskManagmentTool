const { Project, User, UserProject, Task } = require("../models");

// Get all projects
exports.getAllProjects = async (req, res, next) => {
  try {
    let projects;

    // Admins can see all projects
    if (req.user.role === "admin") {
      projects = await Project.findAll({
        include: [{ model: User, attributes: ["id", "email", "username"] }],
      });
    } else {
      // Regular users can only see projects they're members of
      const user = await User.findByPk(req.user.id, {
        include: [{ model: Project }],
      });
      projects = user.Projects;
    }

    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

// Get project by ID
exports.getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id, {
      include: [
        { model: User, attributes: ["id", "email", "username"] },
        { model: Task },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user has access to this project
    if (req.user.role !== "admin") {
      const userProject = await UserProject.findOne({
        where: {
          UserId: req.user.id,
          ProjectId: id,
        },
      });

      if (!userProject) {
        return res
          .status(403)
          .json({ message: "Not authorized to view this project" });
      }
    }

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};

// Create a new project
exports.createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Create project
    const project = await Project.create({
      name,
      description,
    });

    // Add creator as a project member
    await UserProject.create({
      UserId: req.user.id,
      ProjectId: project.id,
    });

    // Fetch the complete project with associations
    const createdProject = await Project.findByPk(project.id, {
      include: [{ model: User, attributes: ["id", "email", "username"] }],
    });

    res.status(201).json({ project: createdProject });
  } catch (error) {
    next(error);
  }
};

// Update a project
exports.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user has permission (admin or project member)
    if (req.user.role !== "admin") {
      const userProject = await UserProject.findOne({
        where: {
          UserId: req.user.id,
          ProjectId: id,
        },
      });

      if (!userProject) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this project" });
      }
    }

    // Update project
    await project.update({
      name,
      description,
    });

    // Fetch updated project with associations
    const updatedProject = await Project.findByPk(id, {
      include: [{ model: User, attributes: ["id", "email", "username"] }],
    });

    res.status(200).json({ project: updatedProject });
  } catch (error) {
    next(error);
  }
};

// Delete a project
exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only admin can delete projects
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete projects" });
    }

    // Delete project
    await project.destroy();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Add user to project
exports.addUserToProject = async (req, res, next) => {
  try {
    const { projectId, userId } = req.body;

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current user has permission to add users to project
    if (req.user.role !== "admin") {
      const userProject = await UserProject.findOne({
        where: {
          UserId: req.user.id,
          ProjectId: projectId,
        },
      });

      if (!userProject) {
        return res
          .status(403)
          .json({ message: "Not authorized to manage this project" });
      }
    }

    // Check if user is already in the project
    const existingMembership = await UserProject.findOne({
      where: {
        UserId: userId,
        ProjectId: projectId,
      },
    });

    if (existingMembership) {
      return res
        .status(400)
        .json({ message: "User is already a member of this project" });
    }

    // Add user to project
    await UserProject.create({
      UserId: userId,
      ProjectId: projectId,
    });

    res.status(200).json({ message: "User added to project successfully" });
  } catch (error) {
    next(error);
  }
};

// Remove user from project
exports.removeUserFromProject = async (req, res, next) => {
  try {
    const { projectId, userId } = req.params;

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the current user has permission to remove users from project
    if (req.user.role !== "admin") {
      const userProject = await UserProject.findOne({
        where: {
          UserId: req.user.id,
          ProjectId: projectId,
        },
      });

      if (!userProject) {
        return res
          .status(403)
          .json({ message: "Not authorized to manage this project" });
      }
    }

    // Find user project membership
    const membership = await UserProject.findOne({
      where: {
        UserId: userId,
        ProjectId: projectId,
      },
    });

    if (!membership) {
      return res
        .status(404)
        .json({ message: "User is not a member of this project" });
    }

    // Remove user from project
    await membership.destroy();

    res.status(200).json({ message: "User removed from project successfully" });
  } catch (error) {
    next(error);
  }
};
