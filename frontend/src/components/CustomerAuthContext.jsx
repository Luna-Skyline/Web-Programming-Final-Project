import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create context
export const AuthContext = createContext();

  // Provider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    user: null,
    token: null,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // On mount, check localStorage for existing auth info
  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    const user = localStorage.getItem("customerUser");

    if (token && user) {
      // Set default axios header for all requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuthState({
        isLoggedIn: true,
        user: JSON.parse(user),
        token,
      });
    }

    setLoading(false);

    // Axios Interceptor for token expiration
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403 || (error.response.data && error.response.data.message && error.response.data.message.includes("jwt expired")))) {
          // Token expired or invalid, log out the user
          logout();
          navigate("/login"); // Redirect to your login page
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

    localStorage.setItem("customerToken", token);
    localStorage.setItem("customerUser", JSON.stringify(userData));

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // Logout function
  const logout = () => {
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: null,
    });

    localStorage.removeItem("customerToken");
    localStorage.removeItem("customerUser");

    // Remove Axios default header
    delete axios.defaults.headers.common["Authorization"];

    // Optional: clear all cookies for site
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
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
