import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProjectById } from "../services/projectService";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await getProjectById(id);
        setProject(data.project);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div
        className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">{error || "Project not found"}</span>
        <div className="mt-4">
          <button
            onClick={() => navigate("/projects")}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

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
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-4">
              {project.name}
            </h1>
            <Link
              to={`/projects/${project.id}/edit`}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
            >
              Edit Project
            </Link>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-400 whitespace-pre-line">
              {project.description || "No description provided."}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Team Members</h2>
            {project.Users && project.Users.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.Users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-500 dark:text-blue-300 mr-3">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No team members assigned.</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <Link
                to={`/tasks/new?projectId=${project.id}`}
                className="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
              >
                Add Task
              </Link>
            </div>

            {project.Tasks && project.Tasks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-300">Title</th>
                      <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-300">Status</th>
                      <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-300">Priority</th>
                      <th className="py-2 px-4 text-left text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.Tasks.map((task) => (
                      <tr key={task.id} className="border-b dark:border-gray-700">
                        <td className="py-2 px-4 text-gray-800 dark:text-gray-300">{task.title}</td>
                        <td className="py-2 px-4 text-gray-800 dark:text-gray-300">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium 
                            ${
                              task.status === "completed"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                : task.status === "in_progress"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                            }`}
                          >
                            {task.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-gray-800 dark:text-gray-300">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium
                            ${
                              task.priority === "high"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                : task.priority === "medium"
                                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-gray-800 dark:text-gray-300">
                          <Link
                            to={`/tasks/edit/${task.id}`}
                            className="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mr-3"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No tasks in this project yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
