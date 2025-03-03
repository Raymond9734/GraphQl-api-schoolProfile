// Authentication utilities

import { createToast, navigateTo } from "../utils.js";
import { GRAPHQL_URL } from "../utils.js";

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
      console.log("The token", token);
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

async function authenticatedFetch(url, options = {}) {
  // Get the JWT token
  const token = getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  // Merge headers with JWT authorization
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      logout(); // Clear auth and redirect to login
      throw new Error("Authentication expired");
    }

    // Handle other error responses
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Authenticated fetch failed:", error);
    throw error;
  }
}

async function fetchData(query) {
  const response = await authenticatedFetch(GRAPHQL_URL, {
    method: "POST",
    body: JSON.stringify(query),
  });

  const data = await response.json();

  if (data.errors) {
    createToast({
      title: "Error",
      description: data.errors[0].message,
      variant: "destructive",
    });
    console.error("Error fetching data:", data.errors[0].message);
    return null;
  }

  return data;
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

export {
  authenticate,
  isAuthenticated,
  logout,
  getToken,
  authenticatedFetch,
  fetchData,
};
