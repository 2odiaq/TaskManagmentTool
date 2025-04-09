const express = require("express");
const router = express.Router();
const { sequelize } = require("../config/database");
const { Comment, User } = require("../models");

// Get all comments for a task
router.get("/task/:taskId", async (req, res, next) => {
  try {
    const { taskId } = req.params;
    
    const comments = await Comment.findAll({
      where: { taskId },
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    
    res.status(200).json({
      status: "success",
      data: comments,
    });
  } catch (error) {
    next(error);
  }
});

// Get a single comment by ID
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
    });
    
    if (!comment) {
      return res.status(404).json({
        status: "error",
        message: "Comment not found",
      });
    }
    
    res.status(200).json({
      status: "success",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
});

// Create a new comment
router.post("/", async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { content, taskId, userId, parentCommentId, mentions, attachments } = req.body;
    
    const comment = await Comment.create(
      {
        content,
        taskId,
        userId,
        parentCommentId,
        mentions,
        attachments,
      },
      { transaction }
    );
    
    await transaction.commit();
    
    // Fetch the created comment with user information
    const newComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
    });
    
    res.status(201).json({
      status: "success",
      data: newComment,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

// Update a comment
router.put("/:id", async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { content, mentions, attachments } = req.body;
    
    const comment = await Comment.findByPk(id);
    
    if (!comment) {
      await transaction.rollback();
      return res.status(404).json({
        status: "error",
        message: "Comment not found",
      });
    }
    
    await comment.update(
      {
        content,
        mentions,
        attachments,
        isEdited: true,
      },
      { transaction }
    );
    
    await transaction.commit();
    
    // Fetch the updated comment with user information
    const updatedComment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
      ],
    });
    
    res.status(200).json({
      status: "success",
      data: updatedComment,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

// Delete a comment
router.delete("/:id", async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    const comment = await Comment.findByPk(id);
    
    if (!comment) {
      await transaction.rollback();
      return res.status(404).json({
        status: "error",
        message: "Comment not found",
      });
    }
    
    await comment.destroy({ transaction });
    
    await transaction.commit();
    
    res.status(200).json({
      status: "success",
      message: "Comment deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

module.exports = router;
