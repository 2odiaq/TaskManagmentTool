import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TaskForm from "../components/Task/TaskForm";
import { getTaskById, updateTask } from "../services/taskService";

const EditTaskPage = () => {
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const data = await getTaskById(id);
        setTask(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch task:", err);
        setError("Failed to load task. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await updateTask(id, formData);
      navigate("/tasks");
    } catch (err) {
      console.error("Failed to update task:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update task. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/tasks");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/tasks")}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Edit Task</h1>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <TaskForm
            initialData={task}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default EditTaskPage;
