import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProjects } from "../services/projectService";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getAllProjects();
        setProjects(data.projects || []);
        setError(null);
      } catch (err) {
        setError("Failed to load projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Projects</h1>
        <Link
          to="/projects/new"
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
        >
          Create Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">No projects found</p>
          <Link
            to="/projects/new"
            className="mt-4 inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-gray-900 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {project.name}
                  </Link>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {project.description || "No description"}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {project.Tasks?.length || 0} tasks
                  </span>
                  <Link
                    to={`/projects/${project.id}/edit`}
                    className="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
