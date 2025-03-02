// Authentication utilities

import { navigateTo } from "../utils.js";

const DOMAIN = "learn.zone01kisumu.ke";

const SIGNIN_URL = `https://${DOMAIN}/api/auth/signin`;

// Mock JWT handling
async function authenticate(credentials) {
  try {
    const token = await getJWT(credentials.identifier, credentials.password);

    if (token) {
      // Store token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("isAuthenticated", "true");
      return token;
    } else {
      throw new Error("Authentication failed");
    }
  } catch (error) {
    throw error;
  }
}

async function getJWT(identifier, password) {
  // Encode credentials in Base64
  const credentials = btoa(`${identifier}:${password}`);
  
  // Set headers
  const headers = {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(SIGNIN_URL, {
      method: "POST",
      headers: headers,
    });

    const token = await response.json();

    if (response.ok) {
      return token; // Return the JWT token
    } else {
      throw new Error(token.message || "Invalid credentials");
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
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
