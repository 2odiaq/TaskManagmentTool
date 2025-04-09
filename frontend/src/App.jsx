import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskListPage from "./pages/TaskListPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import EditTaskPage from "./pages/EditTaskPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import EditProjectPage from "./pages/EditProjectPage";
import Layout from "./components/Layout";
import { useAuth, AuthProvider } from "./context/AuthContext";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Task routes */}
          <Route path="tasks" element={<TaskListPage />} />
          <Route path="tasks/new" element={<CreateTaskPage />} />
          <Route path="tasks/edit/:id" element={<EditTaskPage />} />

          {/* Project routes */}
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/new" element={<CreateProjectPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="projects/:id/edit" element={<EditProjectPage />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
