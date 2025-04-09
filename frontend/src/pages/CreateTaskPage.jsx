import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskForm from "../components/Task/TaskForm";
import { createTask } from "../services/taskService";

const CreateTaskPage = () => {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await createTask(formData);
      navigate("/tasks");
    } catch (err) {
      console.error("Failed to create task:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create task. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/tasks");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Create New Task</h1>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <TaskForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateTaskPage;
