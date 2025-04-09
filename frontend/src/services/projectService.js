import api from "./api";

/**
 * Get all projects for the current user
 * @returns {Promise<Array>} Array of project objects
 */
export const getAllProjects = async () => {
  try {
    const response = await api.get("/projects");
    return response.data;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

/**
 * Get a specific project by ID
 * @param {string} projectId - The ID of the project to fetch
 * @returns {Promise<Object>} Project object
 */
export const getProjectById = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    throw error;
  }
};

/**
 * Create a new project
 * @param {Object} projectData - Project data object
 * @returns {Promise<Object>} Created project object
 */
export const createProject = async (projectData) => {
  try {
    const response = await api.post("/projects", projectData);
    return response.data;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

/**
 * Update an existing project
 * @param {string} projectId - The ID of the project to update
 * @param {Object} projectData - Project data to update
 * @returns {Promise<Object>} Updated project object
 */
export const updateProject = async (projectId, projectData) => {
  try {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error(`Error updating project ${projectId}:`, error);
    throw error;
  }
};

/**
 * Delete a project
 * @param {string} projectId - The ID of the project to delete
 * @returns {Promise<Object>} Response object
 */
export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting project ${projectId}:`, error);
    throw error;
  }
};
