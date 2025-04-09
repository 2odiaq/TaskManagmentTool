import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProject } from "../services/projectService";

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const data = await createProject(formData);
      navigate(`/projects/${data.project.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.response?.data?.message || "Failed to create project",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/projects"
          className="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Projects
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Create New Project</h1>

          {errors.submit && (
            <div
              className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
              >
                Project Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  errors.name ? "border-red-500 dark:border-red-700" : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Enter project name"
              />
              {errors.name && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter project description"
              ></textarea>
            </div>

            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Creating..." : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPage;
