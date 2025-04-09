import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TaskCard from "../components/Task/TaskCard";
import { getAllTasks, updateTask, deleteTask } from "../services/taskService";

const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [isSticky, setIsSticky] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();

    // Set up scroll listener for sticky header
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getAllTasks();
      setTasks(data.tasks || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to load tasks. Please try again later.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Failed to update task status:", err);
      setError("Failed to update task status. Please try again later.");
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter((task) => task.id !== taskId));
      } catch (err) {
        console.error("Failed to delete task:", err);
        setError("Failed to delete task. Please try again later.");
      }
    }
  };

  const handleEdit = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      !searchTerm ||
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort tasks
  const sortTasks = (taskList) => {
    return [...taskList].sort((a, b) => {
      if (sortBy === "dueDate") {
        // Handle null due dates - put them at the end
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === "status") {
        const statusOrder = { todo: 0, "in-progress": 1, done: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  // Group tasks by status
  const todoTasks = sortTasks(
    filteredTasks.filter((task) => task.status === "todo")
  );
  const inProgressTasks = sortTasks(
    filteredTasks.filter((task) => task.status === "in-progress")
  );
  const doneTasks = sortTasks(
    filteredTasks.filter((task) => task.status === "done")
  );

  // Handle section expand/collapse
  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPriorityFilter("");
  };

  // Status section classes and icons
  const statusSections = {
    todo: {
      title: "To Do",
      icon: (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      headerClass:
        "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600",
      iconClass: "text-gray-500 dark:text-gray-400",
    },
    inProgress: {
      title: "In Progress",
      icon: (
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
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      headerClass:
        "text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-600",
      iconClass: "text-purple-500 dark:text-purple-400",
    },
    done: {
      title: "Done",
      icon: (
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
      ),
      headerClass:
        "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-600",
      iconClass: "text-green-500 dark:text-green-400",
    },
  };

  // Active filters display
  const activeFilters = [];
  if (statusFilter) activeFilters.push({ type: "status", value: statusFilter });
  if (priorityFilter)
    activeFilters.push({ type: "priority", value: priorityFilter });
  if (searchTerm) activeFilters.push({ type: "search", value: searchTerm });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const allFilteredTasksEmpty =
    todoTasks.length === 0 &&
    inProgressTasks.length === 0 &&
    doneTasks.length === 0;

  return (
    <div className="container mx-auto animate-fadeIn pb-8">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Sticky toolbar */}
      <div
        className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 ${
          isSticky
            ? "sticky top-0 z-10 shadow-md transition-shadow duration-300 mb-6"
            : "mb-6"
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3">
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            {/* Priority filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>

            {/* Create new task button */}
            <Link
              to="/tasks/new"
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg px-4 py-2 flex items-center"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              New Task
            </Link>
          </div>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {activeFilters.map((filter, index) => (
              <div
                key={index}
                className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
              >
                <span>
                  {filter.type === "status" && "Status: "}
                  {filter.type === "priority" && "Priority: "}
                  {filter.type === "search" && "Search: "}
                  <span className="font-medium">
                    {filter.type === "status" &&
                      (filter.value === "todo"
                        ? "To Do"
                        : filter.value === "in-progress"
                        ? "In Progress"
                        : "Done")}
                    {filter.type === "priority" &&
                      filter.value.charAt(0).toUpperCase() +
                        filter.value.slice(1)}
                    {filter.type === "search" && `"${filter.value}"`}
                  </span>
                </span>
                <button
                  onClick={() => {
                    if (filter.type === "status") setStatusFilter("");
                    if (filter.type === "priority") setPriorityFilter("");
                    if (filter.type === "search") setSearchTerm("");
                  }}
                  className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            {activeFilters.length > 1 && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      {/* Task Lists by Status */}
      {!allFilteredTasksEmpty ? (
        <div className="space-y-6">
          {/* To Do Section */}
          {(statusFilter === "" || statusFilter === "todo") && (
            <div className="animate-fadeIn">
              <div
                className={`flex items-center justify-between px-4 py-2 rounded-lg mb-3 border ${statusSections.todo.headerClass} cursor-pointer`}
                onClick={() => toggleSection("todo")}
              >
                <div className="flex items-center space-x-2">
                  <div className={`${statusSections.todo.iconClass}`}>
                    {statusSections.todo.icon}
                  </div>
                  <h2 className="text-lg font-semibold">
                    {statusSections.todo.title}{" "}
                    <span className="text-sm font-normal">
                      ({todoTasks.length})
                    </span>
                  </h2>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    activeSection === "todo" ? "rotate-180" : ""
                  }`}
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
              </div>

              {(activeSection === "todo" || activeSection === null) &&
                todoTasks.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {todoTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                )}

              {(activeSection === "todo" || activeSection === null) &&
                todoTasks.length === 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center mb-4">
                    <p className="text-gray-500 dark:text-gray-400">
                      No tasks to do
                    </p>
                  </div>
                )}
            </div>
          )}

          {/* In Progress Section */}
          {(statusFilter === "" || statusFilter === "in-progress") && (
            <div className="animate-fadeIn">
              <div
                className={`flex items-center justify-between px-4 py-2 rounded-lg mb-3 border ${statusSections.inProgress.headerClass} cursor-pointer`}
                onClick={() => toggleSection("inProgress")}
              >
                <div className="flex items-center space-x-2">
                  <div className={`${statusSections.inProgress.iconClass}`}>
                    {statusSections.inProgress.icon}
                  </div>
                  <h2 className="text-lg font-semibold">
                    {statusSections.inProgress.title}{" "}
                    <span className="text-sm font-normal">
                      ({inProgressTasks.length})
                    </span>
                  </h2>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    activeSection === "inProgress" ? "rotate-180" : ""
                  }`}
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
              </div>

              {(activeSection === "inProgress" || activeSection === null) &&
                inProgressTasks.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {inProgressTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                )}

              {(activeSection === "inProgress" || activeSection === null) &&
                inProgressTasks.length === 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center mb-4">
                    <p className="text-gray-500 dark:text-gray-400">
                      No tasks in progress
                    </p>
                  </div>
                )}
            </div>
          )}

          {/* Done Section */}
          {(statusFilter === "" || statusFilter === "done") && (
            <div className="animate-fadeIn">
              <div
                className={`flex items-center justify-between px-4 py-2 rounded-lg mb-3 border ${statusSections.done.headerClass} cursor-pointer`}
                onClick={() => toggleSection("done")}
              >
                <div className="flex items-center space-x-2">
                  <div className={`${statusSections.done.iconClass}`}>
                    {statusSections.done.icon}
                  </div>
                  <h2 className="text-lg font-semibold">
                    {statusSections.done.title}{" "}
                    <span className="text-sm font-normal">
                      ({doneTasks.length})
                    </span>
                  </h2>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    activeSection === "done" ? "rotate-180" : ""
                  }`}
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
              </div>

              {(activeSection === "done" || activeSection === null) &&
                doneTasks.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {doneTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                )}

              {(activeSection === "done" || activeSection === null) &&
                doneTasks.length === 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center mb-4">
                    <p className="text-gray-500 dark:text-gray-400">
                      No completed tasks
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="max-w-md mx-auto">
            <svg
              className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>

            {activeFilters.length > 0 ? (
              <>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  No matching tasks found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search or filters to find what you're
                  looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                  No tasks yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get started by creating your first task
                </p>
                <Link
                  to="/tasks/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Create your first task
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListPage;
