// Authentication utilities

import { navigateTo } from "../utils.js";

// Mock JWT handling
function authenticate(credentials) {
  return new Promise((resolve, reject) => {
    // For demo purposes, check if credentials match demo account
    if (
      credentials.email === "demo@school.edu" &&
      credentials.password === "demo123"
    ) {
      // Create a mock JWT
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJlbWFpbCI6ImRlbW9Ac2Nob29sLmVkdSIsImlhdCI6MTYxNjE2MjgwMH0.ZCx2RmeeL8kLXLYq-FvECblmWs6of-0UQ_SAlBxzDI8";

      // Store token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");

      setTimeout(() => resolve(token), 500); // Simulate network delay
    } else {
      setTimeout(() => reject(new Error("Invalid credentials")), 500);
    }
  });
}

function isAuthenticated() {
  return localStorage.getItem("isAuthenticated") === "true";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("isAuthenticated");
  navigateTo("/login");
}

function getToken() {
  return localStorage.getItem("token");
}

export { authenticate, isAuthenticated, logout, getToken };
