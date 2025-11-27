import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

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
