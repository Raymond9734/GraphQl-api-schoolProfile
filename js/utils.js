// Toast notifications
const toasts = [];
let toastIdCounter = 0;

function createToast({ title, description, variant = "default" }) {
  const id = toastIdCounter++;
  const toastTemplate = `
    <div class="toast ${
      variant === "destructive" ? "toast-destructive" : ""
    }" data-id="${id}">
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ""}
        ${
          description
            ? `<div class="toast-description">${description}</div>`
            : ""
        }
      </div>
      <button class="toast-close" aria-label="Close">&times;</button>
    </div>
  `;

  // Get or create toast container
  let toastContainer = document.querySelector(".toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  toastContainer.insertAdjacentHTML("beforeend", toastTemplate);
  const toastElement = toastContainer.lastElementChild;
  toasts.push({ id, element: toastElement });

  // Add close button event listener
  toastElement
    .querySelector(".toast-close")
    .addEventListener("click", () => {
      dismissToast(id);
    });

  // Auto dismiss after 5 seconds
  setTimeout(() => dismissToast(id), 5000);

  return { id, dismiss: () => dismissToast(id) };
}

function dismissToast(id) {
  const toast = toasts.find((t) => t.id === id);
  if (toast) {
    toast.element.classList.add("toast-dismissing");
    setTimeout(() => {
      toast.element.remove();
      toasts.splice(toasts.indexOf(toast), 1);
    }, 300);
  }
}

// Navigation/routing
function navigateTo(path) {
  window.history.pushState(null, "", path);
  window.router.handleRoute();
}

// Format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Create a progress bar element
function createProgress(value) {
  return `
    <div class="progress-bar">
      <div class="progress-bar__value" style="width: ${value}%"></div>
    </div>
  `;
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
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
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
