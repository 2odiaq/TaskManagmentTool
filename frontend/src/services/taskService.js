import api from "./api";

/**
 * Get all tasks for the current user
 * @returns {Promise<Array>} Array of task objects
 */
export const getAllTasks = async () => {
  try {
    const response = await api.get("/tasks");
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

/**
 * Get a specific task by ID
 * @param {string} taskId - The ID of the task to fetch
 * @returns {Promise<Object>} Task object
 */
export const getTaskById = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task ${taskId}:`, error);
    throw error;
  }
};

/**
 * Create a new task
 * @param {Object} taskData - Task data object
 * @returns {Promise<Object>} Created task object
 */
export const createTask = async (taskData) => {
  try {
    const response = await api.post("/tasks", taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

/**
 * Update an existing task
 * @param {string} taskId - The ID of the task to update
 * @param {Object} taskData - Task data to update
 * @returns {Promise<Object>} Updated task object
 */
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    console.error(`Error updating task ${taskId}:`, error);
    throw error;
  }
};

/**
 * Delete a task
 * @param {string} taskId - The ID of the task to delete
 * @returns {Promise<Object>} Response object
 */
export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
};

/**
 * Get tasks by project ID
 * @param {string} projectId - The ID of the project
 * @returns {Promise<Array>} Array of task objects
 */
export const getTasksByProject = async (projectId) => {
  try {
    const response = await api.get(`/tasks?projectId=${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks for project ${projectId}:`, error);
    throw error;
  }
};
