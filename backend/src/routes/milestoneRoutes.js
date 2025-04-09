const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/database");
const { Milestone, Task } = require("../models");

// Get all milestones for a project
router.get("/project/:projectId", async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    const milestones = await Milestone.findAll({
      where: { projectId },
      order: [["order", "ASC"], ["createdAt", "ASC"]],
    });
    
    res.status(200).json({
      status: "success",
      data: milestones,
    });
  } catch (error) {
    next(error);
  }
});

// Get a single milestone by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const milestone = await Milestone.findByPk(id, {
      include: [
        {
          model: Task,
          as: "tasks",
        },
      ],
    });
    
    if (!milestone) {
      return res.status(404).json({
        status: "error",
        message: "Milestone not found",
      });
    }
    
    res.status(200).json({
      status: "success",
      data: milestone,
    });
  } catch (error) {
    next(error);
  }
});

// Create a new milestone
router.post("/", async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { title, description, dueDate, projectId, status, color, order } = req.body;
    
    const milestone = await Milestone.create(
      {
        title,
        description,
        dueDate,
        projectId,
        status,
        color,
        order,
      },
      { transaction }
    );
    
    await transaction.commit();
    
    res.status(201).json({
      status: "success",
      data: milestone,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

// Update a milestone
router.put("/:id", async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { title, description, dueDate, status, color, order } = req.body;
    
    const milestone = await Milestone.findByPk(id);
    
    if (!milestone) {
      await transaction.rollback();
      return res.status(404).json({
        status: "error",
        message: "Milestone not found",
      });
    }
    
    await milestone.update(
      {
        title,
        description,
        dueDate,
        status,
        color,
        order,
      },
      { transaction }
    );
    
    await transaction.commit();
    
    res.status(200).json({
      status: "success",
      data: milestone,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

// Delete a milestone
router.delete("/:id", async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    const milestone = await Milestone.findByPk(id);
    
    if (!milestone) {
      await transaction.rollback();
      return res.status(404).json({
        status: "error",
        message: "Milestone not found",
      });
    }
    
    // Update any tasks associated with this milestone to have null milestoneId
    await Task.update(
      { milestoneId: null },
      { where: { milestoneId: id }, transaction }
    );
    
    await milestone.destroy({ transaction });
    
    await transaction.commit();
    
    res.status(200).json({
      status: "success",
      message: "Milestone deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

module.exports = router;
