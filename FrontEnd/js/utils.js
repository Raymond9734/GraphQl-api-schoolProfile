// Utility functions

// Toast notifications
const toasts = [];
let toastIdCounter = 0;

function createToast({ title, description, variant = "default" }) {
  const id = toastIdCounter++;
  const toast = document.createElement("div");
  toast.className = `toast ${
    variant === "destructive" ? "toast-destructive" : ""
  }`;
  toast.dataset.id = id;

  toast.innerHTML = `
    <div>
      ${title ? `<div class="toast-title">${title}</div>` : ""}
      ${
        description ? `<div class="toast-description">${description}</div>` : ""
      }
    </div>
    <button class="toast-close" aria-label="Close">&times;</button>
  `;

  // Get or create toast container
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  toastContainer.appendChild(toast);
  toasts.push({ id, element: toast });

  // Add close button event listener
  toast.querySelector(".toast-close").addEventListener("click", () => {
    dismissToast(id);
  });

  // Auto dismiss after 5 seconds
  setTimeout(() => dismissToast(id), 5000);

  return { id, dismiss: () => dismissToast(id) };
}

function dismissToast(id) {
  const index = toasts.findIndex((t) => t.id === id);
  if (index !== -1) {
    const toast = toasts[index].element;
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      toast.remove();
      toasts.splice(index, 1);
    }, 300);
  }
}

// Navigation/routing
function navigateTo(path) {
  window.history.pushState(null, "", path);
  router();
}

// Format numbers with commas
function formatNumber(num) {
  return num.toLocaleString();
}

// Create a progress bar element
function createProgress(value) {
  const progress = document.createElement("div");
  progress.className = "progress";

  const progressValue = document.createElement("div");
  progressValue.className = "progress-value";
  progressValue.style.width = `${value}%`;

  progress.appendChild(progressValue);
  return progress;
}

// Create SVG element and helpers for charts
function createSVG(width, height) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  return svg;
}

function createSVGElement(type) {
  return document.createElementNS("http://www.w3.org/2000/svg", type);
}

// Calculate date ranges
function getDateRange(days) {
  const now = new Date();
  const start = new Date();
  start.setDate(now.getDate() - days);
  return { start, end: now };
}

export {
  createToast,
  navigateTo,
  formatNumber,
  createProgress,
  createSVG,
  createSVGElement,
  getDateRange,
};
