import { useState, useEffect } from "react";
import api from "../../services/api";

const TaskForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
    projectId: "",
    assignedTo: "",
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        priority: initialData.priority || "medium",
        status: initialData.status || "todo",
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split("T")[0]
          : "",
        projectId: initialData.projectId || "",
        assignedTo: initialData.assignedTo || "",
      });
    }
  }, [initialData]);

  // Fetch projects and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        try {
          const projectsRes = await api.get("/projects");
          setProjects(projectsRes.data.projects || []);
        } catch (err) {
          console.error("Error fetching projects:", err);
          setProjects([]);
        }

        try {
          const usersRes = await api.get("/users");
          setUsers(usersRes.data.users || []);
        } catch (err) {
          console.error("Error fetching users:", err);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        setError("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a cleaned version of the form data
    const cleanedData = { ...formData };

    // Ensure dueDate is valid or null
    if (cleanedData.dueDate) {
      const dateObj = new Date(cleanedData.dueDate);
      if (isNaN(dateObj.getTime())) {
        cleanedData.dueDate = null;
      }
    } else {
      cleanedData.dueDate = null;
    }

    // Pass the cleaned data to the parent component
    onSubmit(cleanedData);
  };

  // Priority color mapping for visual indicators
  const priorityColors = {
    low: "bg-primary-100 text-primary-500 dark:bg-primary-900/30 dark:text-primary-300",
    medium:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300",
    high: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300",
  };

  // Status color mapping
  const statusColors = {
    todo: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    "in-progress":
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300",
    done: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300",
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
        {error}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto animate-fadeIn"
    >
      {/* Two-column layout on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Left column - Main content */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 
                text-gray-900 dark:text-white bg-white dark:bg-gray-700
                focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
              placeholder="Enter task title"
              required
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 
                text-gray-900 dark:text-white bg-white dark:bg-gray-700
                focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
              placeholder="Add task details here..."
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="projectId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Project
            </label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 
                text-gray-900 dark:text-white bg-white dark:bg-gray-700
                focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
            >
              <option value="">No Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {/* Right column - Task details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["low", "medium", "high"].map((priority) => (
                <label
                  key={priority}
                  className={`
                    flex items-center justify-center px-4 py-2.5 rounded-lg cursor-pointer border
                    ${
                      formData.priority === priority
                        ? `${priorityColors[priority]} border-transparent`
                        : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={formData.priority === priority}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="capitalize">
                    {priority === "low" && (
                      <svg
                        className="w-4 h-4 mr-1.5 inline-block"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    )}
                    {priority === "medium" && (
                      <svg
                        className="w-4 h-4 mr-1.5 inline-block"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h14"
                        />
                      </svg>
                    )}
                    {priority === "high" && (
                      <svg
                        className="w-4 h-4 mr-1.5 inline-block"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                    {priority}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "todo", label: "To Do" },
                { value: "in-progress", label: "In Progress" },
                { value: "done", label: "Done" },
              ].map((status) => (
                <label
                  key={status.value}
                  className={`
                    flex items-center justify-center px-4 py-2.5 rounded-lg cursor-pointer border
                    ${
                      formData.status === status.value
                        ? `${statusColors[status.value]} border-transparent`
                        : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={formData.status === status.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span>{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 
                text-gray-900 dark:text-white bg-white dark:bg-gray-700
                focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
            />
          </div>

          {users.length > 0 && (
            <div>
              <label
                htmlFor="assignedTo"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Assign To
              </label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 
                  text-gray-900 dark:text-white bg-white dark:bg-gray-700
                  focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400"
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username || user.email}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800"
        >
          {initialData ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
