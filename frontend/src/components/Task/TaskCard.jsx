import { useState } from "react";

const TaskCard = ({ task, onStatusChange, onDelete, onEdit }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle status update
  const handleStatusChange = (newStatus) => {
    onStatusChange(task.id, newStatus);
    setIsMenuOpen(false);
  };

  // Handle edit
  const handleEdit = () => {
    onEdit(task.id);
    setIsMenuOpen(false);
  };

  // Check if task is due soon (within 2 days)
  const isDueSoon = () => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(today.getDate() + 2);
    return dueDate <= twoDaysFromNow && dueDate >= today;
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today && task.status !== "done";
  };

  // Status display name
  const getStatusDisplay = (status) => {
    return status === "todo"
      ? "To Do"
      : status === "in-progress"
      ? "In Progress"
      : "Done";
  };

  // Priority and status styling
  const priorityStyles = {
    low: "bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800",
    medium:
      "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    high: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
  };

  const statusStyles = {
    todo: "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700",
    "in-progress":
      "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    done: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Card header with priority indicator */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1">
          {task.title}
        </h3>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Task options"
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute right-4 mt-10 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10 animate-fadeIn">
            <div className="py-1">
              <button
                onClick={handleEdit}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center"
              >
                <svg
                  className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Task
              </button>
              <button
                onClick={() => handleStatusChange("todo")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center"
              >
                <svg
                  className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400"
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
                Mark as To Do
              </button>
              <button
                onClick={() => handleStatusChange("in-progress")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center"
              >
                <svg
                  className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400"
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
                Mark as In Progress
              </button>
              <button
                onClick={() => handleStatusChange("done")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center"
              >
                <svg
                  className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400"
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
                Mark as Done
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this task?")
                  ) {
                    onDelete(task.id);
                  }
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 flex items-center"
              >
                <svg
                  className="h-4 w-4 mr-2 text-red-500 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Task
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-4">
        {/* Description if available */}
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Task details */}
        <div className="flex flex-col space-y-2">
          {/* Due date */}
          {task.dueDate && (
            <div className="flex items-center">
              <svg
                className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500"
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
              <span
                className={`text-sm ${
                  isOverdue()
                    ? "text-red-600 dark:text-red-400 font-medium"
                    : isDueSoon()
                    ? "text-yellow-600 dark:text-yellow-400 font-medium"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {formatDate(task.dueDate)}
                {isOverdue() && " (Overdue)"}
                {isDueSoon() && !isOverdue() && " (Soon)"}
              </span>
            </div>
          )}

          {/* Project if available */}
          {task.project && (
            <div className="flex items-center">
              <svg
                className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {task.project.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Card footer with tags */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
        {/* Priority badge */}
        <span
          className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full border ${
            priorityStyles[task.priority]
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1 ${
              task.priority === "high"
                ? "bg-red-500"
                : task.priority === "medium"
                ? "bg-yellow-500"
                : "bg-primary-500"
            }`}
          ></span>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        {/* Status badge */}
        <span
          className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full border ${
            statusStyles[task.status]
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full mr-1 ${
              task.status === "done"
                ? "bg-green-500"
                : task.status === "in-progress"
                ? "bg-purple-500"
                : "bg-gray-500"
            }`}
          ></span>
          {getStatusDisplay(task.status)}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
