import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      if (token) {
        try {
          const res = await api.get("/auth/me");
          setUser(res.data.user);
        } catch (error) {
          console.error("Authentication error:", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // Safety check for undefined values
      const safeUserData = {
        email: userData.email?.toLowerCase() || "",
        password: userData.password || "",
        username: userData.username || userData.email?.split("@")[0] || "",
      };

      // Validate required fields
      if (!safeUserData.email || !safeUserData.password) {
        setError("Email and password are required");
        setLoading(false);
        return false;
      }

      const res = await api.post("/auth/register", safeUserData);

      // Check for success response
      if (!res.data || !res.data.token) {
        setError("Invalid response from server");
        setLoading(false);
        return false;
      }

      const { token: newToken } = res.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);

      try {
        // Get user details
        const userRes = await api.get("/auth/me");
        if (userRes.data && userRes.data.user) {
          setUser(userRes.data.user);
        }
      } catch (userError) {
        console.error("Error fetching user details:", userError);
        // Continue anyway since registration was successful
      }

      return true;
    } catch (error) {
      console.error("Registration error:", error);

      // Handle validation errors from the server
      if (error.response?.data?.message === "Validation failed") {
        const errorMessages = error.response.data.errors || [];

        // Create a formatted error message for display
        const formattedErrors = errorMessages
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");

        setError(
          formattedErrors || "Registration failed due to validation errors"
        );
      } else {
        // General error handling
        setError(
          error.response?.data?.message ||
            "An error occurred during registration"
        );
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Attempting login with:", { email: userData.email }); // Log login attempt but omit password

      // Safety check for undefined values
      const safeUserData = {
        email: userData.email?.toLowerCase() || "",
        password: userData.password || "",
      };

      // Validate required fields
      if (!safeUserData.email || !safeUserData.password) {
        setError("Email and password are required");
        setLoading(false);
        return false;
      }

      console.log("Sending login request to:", `/api/v1/auth/login`);

      const res = await api.post("/auth/login", safeUserData);

      console.log("Login response:", {
        status: res.status,
        hasToken: !!res.data?.token,
      });

      // Check for success response
      if (!res.data || !res.data.token) {
        setError("Invalid response from server");
        setLoading(false);
        return false;
      }

      const { token: newToken, user: userData2 } = res.data;

      // Only set if we have valid data
      if (newToken) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
      }

      if (userData2) {
        setUser(userData2);
      }

      return true;
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config?.url,
      });

      // Handle validation errors from the server
      if (
        error.response?.data?.message === "Validation failed" ||
        error.response?.data?.message === "Authentication failed"
      ) {
        const errorMessages = error.response.data.errors || [];

        // Create a formatted error message for display
        const formattedErrors = errorMessages
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");

        setError(formattedErrors || "Login failed");
      } else {
        // General error handling
        setError(
          error.response?.data?.message ||
            error.message ||
            "Invalid credentials"
        );
      }

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
