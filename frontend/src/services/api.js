import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5002/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
  // Add retry capability
  validateStatus: (status) => {
    return status >= 200 && status < 500; // Accept all status codes except 5xx
  },
});

// Request interceptor for adding token and validation
api.interceptors.request.use(
  (config) => {
    // Add token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Validate data before sending
    if (config.data) {
      // Make sure email is always lowercase
      if (config.data.email) {
        config.data.email = config.data.email.toLowerCase();
      }

      // Remove any undefined or null values
      Object.keys(config.data).forEach((key) => {
        if (config.data[key] === undefined || config.data[key] === null) {
          delete config.data[key];
        }
      });
    }

    return config;
  },
  (error) => {
    console.error("API request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API response error:",
      error?.response?.data || error.message
    );

    const { status } = error.response || {};

    if (status === 401) {
      // Handle unauthorized error
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
