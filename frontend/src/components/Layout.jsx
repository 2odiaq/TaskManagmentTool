import { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for saved theme preference or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  // Navigation items with improved icons
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          className="mr-3 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: (
        <svg
          className="mr-3 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      name: "Projects",
      path: "/projects",
      icon: (
        <svg
          className="mr-3 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
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
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-800 w-64 z-30 transform transition duration-300 ease-in-out md:translate-x-0 shadow-sidebar ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-primary-500 dark:bg-primary-600 text-white font-bold text-xl">
          <Link to="/" className="flex items-center">
            <svg
              className="h-8 w-8 mr-2"
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
            TaskMaster
          </Link>
        </div>

        {/* User profile in sidebar */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-500 dark:text-primary-300 flex items-center justify-center">
                {user?.username?.charAt(0)?.toUpperCase() ||
                  user?.email?.charAt(0)?.toUpperCase() ||
                  "U"}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {user?.username || user?.email}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {user?.role || "User"}
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-primary-50 dark:bg-primary-900/50 text-primary-500 dark:text-primary-300 border-l-4 border-primary-500 dark:border-primary-400"
                  : "text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-500 dark:hover:text-primary-300"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <span
                className={
                  isActive(item.path)
                    ? "text-primary-500 dark:text-primary-300"
                    : "text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-300"
                }
              >
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout button at bottom of sidebar */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 rounded-md text-sm font-medium transition duration-200"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center px-6 sm:px-10 md:px-16 py-3">
            <div className="flex items-center">
              <button
                type="button"
                className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none mr-3"
                onClick={() => setSidebarOpen(true)}
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {location.pathname.includes("/dashboard")
                  ? "Dashboard"
                  : location.pathname.includes("/tasks")
                  ? "Tasks"
                  : location.pathname.includes("/projects")
                  ? "Projects"
                  : "TaskMaster"}
              </h1>
            </div>

            {/* Right side of header - quick actions */}
            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>

              {/* Help icon */}
              <button
                type="button"
                className="p-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Help"
              >
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
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              {/* Notifications button */}
              <button
                type="button"
                className="p-1 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                aria-label="Notifications"
              >
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {/* Notification badge */}
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
              </button>

              {/* User menu (simplified) */}
              <div className="flex-shrink-0 relative">
                <button className="rounded-full h-8 w-8 bg-primary-100 dark:bg-primary-900 text-primary-500 dark:text-primary-300 flex items-center justify-center">
                  {user?.username?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 px-6 sm:px-10 md:px-16 py-8 mx-auto max-w-8xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
