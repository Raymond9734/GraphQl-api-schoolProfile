import { createLayout } from "../components/components.js";

function createErrorPage(code, title, description) {
  return `
    <div class="error-container">
      <div class="error-content">
        <h1 class="error-code">${code}</h1>
        <h2 class="error-title">${title}</h2>
        <p class="error-description">${description}</p>
        <button class="btn btn-primary" onclick="window.router.navigateTo('/')">
          Go Home
        </button>
      </div>
    </div>
  `;
}

function render404() {
  const content = createErrorPage(
    "404",
    "Page Not Found",
    "The page you're looking for doesn't exist or has been moved."
  );
  const root = document.getElementById("root");
  root.innerHTML = createLayout(content);
}

function render500() {
  const content = createErrorPage(
    "500",
    "Server Error",
    "Something went wrong on our servers. Please try again later."
  );
  const root = document.getElementById("root");
  root.innerHTML = createLayout(content);
}

function render400() {
  const content = createErrorPage(
    "400",
    "Bad Request",
    "The request could not be understood by the server."
  );
  const root = document.getElementById("root");
  root.innerHTML = createLayout(content);
}

export { render404, render500, render400 };
