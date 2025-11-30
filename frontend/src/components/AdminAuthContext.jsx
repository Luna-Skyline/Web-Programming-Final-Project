import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create Admin context
export const AdminAuthContext = createContext();

// Provider component
export const AdminAuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
    token: null,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On mount, check localStorage for existing admin auth info
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const user = localStorage.getItem("adminUser");

    if (token && user) {
      // Set default axios header for all requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuthState({
        isLoggedIn: true,
        user: JSON.parse(user),
        token,
      });
    }

    //Delay setting loading=false to next tick (prevents race condition)
    setTimeout(() => {
      setLoading(false);
    }, 0);

    setLoading(false);

    // Axios Interceptor for admin token expiration
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response &&
          (error.response.status === 401 ||
            error.response.status === 403 ||
            (error.response.data &&
              error.response.data.message &&
              error.response.data.message.includes("jwt expired")))
        ) {
          // Token expired or invalid, log out the admin
          logout();
          navigate("/admin/login"); // Redirect to the admin login page (or main login, as per current setup)
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptor on component unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);
  // Login function
  const login = (userData, token) => {
    setAuthState({
      isLoggedIn: true,
      user: userData,
      token,
    });

    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(userData));

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // Logout function
  const logout = () => {
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: null,
    });

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    // Remove Axios default header
    delete axios.defaults.headers.common["Authorization"];

    // Optional: clear all cookies for site - this might be too broad for admin specific logout.
    // Consider if this should only clear admin-related cookies or all.
    // For now, leaving it as-is from the original context.
    document.cookie
      .split(";")
      .forEach(
        (c) =>
          (document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            ))
      );
  };

  return (
    <AdminAuthContext.Provider
      value={{
        authState,
        setAuthState,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
