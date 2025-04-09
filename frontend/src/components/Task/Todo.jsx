import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "./TaskCard";

const Todo = ({ tasks = [], onStatusChange, onDelete, onEdit }) => {
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure tasks is an array before using array methods
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    let result = [...tasksArray];

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          (task.description && task.description.toLowerCase().includes(query))
      );
    }

    setFilteredTasks(result);
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  const handleAddTask = () => {
    navigate("/tasks/new");
  };

  // Get counts for tasks by status
  const getTaskCounts = () => {
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    return {
      total: tasksArray.length,
      todo: tasksArray.filter((task) => task.status === "todo").length,
      inProgress: tasksArray.filter((task) => task.status === "in-progress")
        .length,
      done: tasksArray.filter((task) => task.status === "done").length,
    };
  };

  const counts = getTaskCounts();

  return (
    <div className="w-full">
      {/* Page header with stats */}
      <div className="flex flex-col space-y-6 pb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={handleAddTask}
            className="bg-accent-500 hover:bg-accent-600 text-white font-medium px-4 py-2 rounded-md transition duration-300 shadow-sm flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Task
          </button>
        </div>

        {/* Task statistics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-50 text-primary-500">
                <svg
                  className="h-6 w-6"
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
                <h3 className="text-sm font-medium text-gray-600">
                  Total Tasks
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {counts.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-50 text-gray-600">
                <svg
                  className="h-6 w-6"
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
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600">To Do</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {counts.todo}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-50 text-purple-500">
                <svg
                  className="h-6 w-6"
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
                <h3 className="text-sm font-medium text-gray-600">
                  In Progress
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {counts.inProgress}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50 text-green-500">
                <svg
                  className="h-6 w-6"
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
                <h3 className="text-sm font-medium text-gray-600">Done</h3>
                <p className="text-2xl font-bold text-gray-800">
                  {counts.done}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="w-full sm:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-2"
              >
                <option value="all">All Statuses</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="w-full sm:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-2"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-800">
              No tasks found
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters or search query"
                : "Get started by adding your first task"}
            </p>
            {!searchQuery &&
              statusFilter === "all" &&
              priorityFilter === "all" && (
                <button
                  onClick={handleAddTask}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Task
                </button>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo;
