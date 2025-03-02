import { logout } from "../auth/auth.js";

// Navigation Menu Component
function createNavigationMenu() {
  const path = window.location.pathname;
  return `
    <nav class="navigation">
      <div class="navigation__container">
        <div class="navigation__links">
          <a href="/" class="navigation__link ${
            path === "/" || path === "" ? "navigation__link--active" : ""
          }" data-nav-link="/">Profile</a>
          <a href="/stats" class="navigation__link ${
            path === "/stats" ? "navigation__link--active" : ""
          }" data-nav-link="/stats">Statistics</a>
        </div>
        <button class="navigation__logout" id="logoutButton">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </nav>
  `;
}

// Page Layout Component
function createLayout(content) {
  return `
    <div class="layout">
      ${createNavigationMenu()}
      <main class="main-content">
        ${content}
      </main>
    </div>
  `;
}

// Avatar Component
function createAvatar(imageUrl, firstName, lastName) {
  const initials = `${firstName[0]}${lastName[0]}`;
  return `
    <div class="avatar">
      ${
        imageUrl
          ? `<img src="${imageUrl}" alt="${firstName} ${lastName}" class="avatar__image" onerror="this.parentElement.innerHTML='<div class=\'avatar__fallback\'>${initials}</div>'">`
          : `<div class="avatar__fallback">${initials}</div>`
      }
    </div>
  `;
}

// Card Component
function createCard(className = "") {
  return `<div class="card ${className}"></div>`;
}

// Animated Card Component
function createAnimatedCard(delay = 0, className = "") {
  return `<div class="card card--glass card--hover card--animated" style="animation-delay: ${delay}ms; opacity: 0;${
    className ? ` ${className}` : ""
  }"></div>`;
}

// Card Header Component
function createCardHeader(title) {
  return `
    <div class="card__header">
      <h3 class="card__title">${title}</h3>
    </div>
  `;
}

// Card Content Component
function createCardContent() {
  return `<div class="card__content"></div>`;
}

// Spinner Component
function createSpinner(className = "") {
  return `
    <div class="spinner ${className}" role="status" aria-label="Loading">
      <div class="spinner-circle "></div>
    </div>
  `;
}

function createLoadingSpinner() {
  return `
    <div class="spinner-container ">
      ${createSpinner()}
    </div>
  `;
}

// Add this function to setup navigation events
function setupNavigationEvents() {
  // Handle navigation links
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const path = link.getAttribute("data-nav-link");
      window.router.navigateTo(path);
    });
  });

  // Handle logout button
  const logoutBtn = document.getElementById("logoutButton");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (typeof window.logout === "function") {
        window.logout();
      } else if (typeof logout === "function") {
        logout();
      }
    });
  }
}

export {
  createNavigationMenu,
  createLayout,
  createAvatar,
  createCard,
  createAnimatedCard,
  createCardHeader,
  createCardContent,
  createSpinner,
  createLoadingSpinner,
  setupNavigationEvents, // Export the new function
};
