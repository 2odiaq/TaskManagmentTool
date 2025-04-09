import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TaskCard from "../components/Task/TaskCard";
import { getAllTasks, updateTask, deleteTask } from "../services/taskService";
import { getAllProjects } from "../services/projectService";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });
  const [todayFilter, setTodayFilter] = useState(false);
  const navigate = useNavigate();

  // Fetch tasks and projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tasksData, projectsData] = await Promise.all([
          getAllTasks(),
          getAllProjects(),
        ]);

        const fetchedTasks = tasksData.tasks || [];
        const fetchedProjects = projectsData.projects || [];

        setTasks(fetchedTasks);
        setProjects(fetchedProjects);

        // Calculate stats
        setStats({
          totalTasks: fetchedTasks.length,
          todoTasks: fetchedTasks.filter((task) => task.status === "todo")
            .length,
          inProgressTasks: fetchedTasks.filter(
            (task) => task.status === "in-progress"
          ).length,
          completedTasks: fetchedTasks.filter((task) => task.status === "done")
            .length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle task status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });

      // Update local state
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      // Update stats
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );

      setStats({
        totalTasks: updatedTasks.length,
        todoTasks: updatedTasks.filter((task) => task.status === "todo").length,
        inProgressTasks: updatedTasks.filter(
          (task) => task.status === "in-progress"
        ).length,
        completedTasks: updatedTasks.filter((task) => task.status === "done")
          .length,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Delete task
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);

      // Update local state
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);

      // Update stats
      setStats({
        totalTasks: updatedTasks.length,
        todoTasks: updatedTasks.filter((task) => task.status === "todo").length,
        inProgressTasks: updatedTasks.filter(
          (task) => task.status === "in-progress"
        ).length,
        completedTasks: updatedTasks.filter((task) => task.status === "done")
          .length,
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Edit task
  const handleEdit = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  // Check if a task is due today
  const isDueToday = (task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  };

  // Check if a task is overdue
  const isOverdue = (task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today && task.status !== "done";
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

  // Filter tasks for different sections
  const upcomingTasks = tasks
    .filter((task) => task.status !== "done" && task.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Today's focus tasks - high priority tasks due today or overdue
  const todaysFocusTasks = tasks
    .filter(
      (task) =>
        task.status !== "done" &&
        ((task.priority === "high" && (isDueToday(task) || isOverdue(task))) ||
          isOverdue(task))
    )
    .sort((a, b) => {
      // Sort by overdue first, then by priority
      if (isOverdue(a) && !isOverdue(b)) return -1;
      if (!isOverdue(a) && isOverdue(b)) return 1;

      // Then by priority
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 3);

  // Filter tasks by due today or overdue, if filter is enabled
  const filteredUpcomingTasks = todayFilter
    ? upcomingTasks.filter((task) => isDueToday(task) || isOverdue(task))
    : upcomingTasks;

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Dashboard Overview
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setTodayFilter(!todayFilter)}
            className={`text-sm px-3 py-1.5 rounded-lg flex items-center transition-colors ${
              todayFilter
                ? "bg-primary-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <svg
              className="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {todayFilter ? "All Tasks" : "Due Today/Overdue"}
          </button>

          <Link
            to="/tasks/new"
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-1.5 rounded-lg transition duration-200 shadow-sm flex items-center"
          >
            <svg
              className="mr-1.5 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Task
          </Link>
        </div>
      </div>

      {/* Stats with improved visuals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-500 dark:text-primary-300">
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Tasks
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {stats.totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                To Do
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {stats.todoTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                In Progress
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {stats.inProgressTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300">
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Completed
              </h3>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {stats.completedTasks}
              </p>
            </div>
          </div>
          {stats.totalTasks > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{
                    width: `${Math.round(
                      (stats.completedTasks / stats.totalTasks) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
                complete
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Today's Focus Section */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-red-500 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Today's Focus
              </h2>
            </div>

            <div className="space-y-3">
              {todaysFocusTasks.length > 0 ? (
                todaysFocusTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-gray-50 dark:bg-gray-750 rounded-lg border-l-4 border-red-500 dark:border-red-400 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        {task.title}
                      </h3>
                      <div className="flex space-x-2 mt-1">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            task.priority === "high"
                              ? "bg-red-500 dark:bg-red-400"
                              : task.priority === "medium"
                              ? "bg-yellow-500 dark:bg-yellow-400"
                              : "bg-blue-500 dark:bg-blue-400"
                          }`}
                        ></span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {isOverdue(task) ? "Overdue" : "Due Today"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => handleStatusChange(task.id, "done")}
                        className="p-1 text-gray-400 hover:text-green-500 dark:hover:text-green-400 rounded-full transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>No urgent tasks for today</p>
                  <p className="text-sm mt-1">
                    Great job staying on top of things!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Projects with completion status */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Projects Overview
              </h2>
              <Link
                to="/projects"
                className="text-sm text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300"
              >
                View All
              </Link>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.slice(0, 4).map((project) => {
                  // Calculate project completion stats
                  const projectTasks = tasks.filter(
                    (task) => task.projectId === project.id
                  );
                  const completedTasks = projectTasks.filter(
                    (task) => task.status === "done"
                  );
                  const completionPercentage =
                    projectTasks.length > 0
                      ? Math.round(
                          (completedTasks.length / projectTasks.length) * 100
                        )
                      : 0;

                  return (
                    <div
                      key={project.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <Link to={`/projects/${project.id}`}>
                        <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                          {project.name}
                        </h3>
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span>Progress</span>
                          <span>
                            {completedTasks.length}/{projectTasks.length} tasks
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              completionPercentage === 100
                                ? "bg-green-500"
                                : "bg-primary-500"
                            }`}
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <svg
                  className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                <p>No projects yet</p>
                <Link
                  to="/projects/new"
                  className="inline-block mt-2 text-sm text-primary-500 hover:text-primary-600"
                >
                  + Create your first project
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Tasks with improved cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {todayFilter ? "Due Today / Overdue" : "Upcoming Tasks"}
          </h2>
          <Link
            to="/tasks"
            className="text-sm text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300"
          >
            View All
          </Link>
        </div>

        {filteredUpcomingTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUpcomingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
            <svg
              className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {todayFilter
                ? "No tasks due today or overdue"
                : "No upcoming tasks"}
            </p>
            <Link
              to="/tasks/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create a new task
            </Link>
          </div>
        )}
      </div>

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Recently Added
          </h2>
        </div>

        {recentTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
            <svg
              className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No recent tasks
            </p>
            <Link
              to="/tasks/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create your first task
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
