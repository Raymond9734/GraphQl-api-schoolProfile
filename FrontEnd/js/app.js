// Main application logic
import { renderLogin } from "./loginPage/login.js";
import { renderProfile } from "./homeProfilePage/profile.js";
import { renderStats } from "./statsPage/stats.js";
import { isAuthenticated } from "./auth/auth.js";
import { render404, render500, render400 } from "./errorPages/errors.js";

class Router {
  constructor() {
    this.rootElement = document.getElementById("root");
    this.routes = {
      "/login": renderLogin,
      "/": renderProfile,
      "/stats": renderStats,
      "/404": render404,
      "/500": render500,
      "/400": render400,
    };

    // Bind methods to instance
    this.handleRoute = this.handleRoute.bind(this);
    this.navigateTo = this.navigateTo.bind(this);

    // Set up event listeners
    window.addEventListener("popstate", this.handleRoute);
  }

  clearRoot() {
    while (this.rootElement.firstChild) {
      this.rootElement.removeChild(this.rootElement.firstChild);
    }
  }

  navigateTo(path) {
    window.history.pushState(null, "", path);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    this.clearRoot();

    if (path === "/login" || (!isAuthenticated() && path !== "/login")) {
      this.routes["/login"]();
    } else if (this.routes[path] || path === "") {
      this.routes[path || "/"]();
    } else {
      this.routes["/404"]();
    }
  }

  init() {
    this.handleRoute();
  }
}

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  window.router = new Router();
  window.router.init();
});
