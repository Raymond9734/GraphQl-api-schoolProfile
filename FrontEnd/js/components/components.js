import { logout } from "../auth/auth.js";
import { navigateTo, createSVG, createSVGElement } from "../utils.js";

// UI Components

// Navigation Menu Component
function createNavigationMenu() {
  const nav = document.createElement("nav");

  const container = document.createElement("div");
  container.className = "container nav-container";

  const links = document.createElement("div");
  links.className = "nav-links";

  // Profile link
  const profileLink = document.createElement("a");
  profileLink.href = "/";
  profileLink.textContent = "Profile";
  profileLink.className = "nav-link";
  profileLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/");
  });

  // Stats link
  const statsLink = document.createElement("a");
  statsLink.href = "/stats";
  statsLink.textContent = "Statistics";
  statsLink.className = "nav-link";
  statsLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigateTo("/stats");
  });

  // Update active link based on current path
  const path = window.location.pathname;
  if (path === "/" || path === "") {
    profileLink.classList.add("nav-link-active");
  } else if (path === "/stats") {
    statsLink.classList.add("nav-link-active");
  }

  links.appendChild(profileLink);
  links.appendChild(statsLink);

  // Logout button
  const logoutButton = document.createElement("button");
  logoutButton.className = "btn btn-ghost";
  logoutButton.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Logout';
  logoutButton.addEventListener("click", logout);

  container.appendChild(links);
  container.appendChild(logoutButton);
  nav.appendChild(container);

  return nav;
}

// Page Layout Component
function createLayout(content) {
  const layout = document.createElement("div");
  layout.className = "min-h-screen bg-background";

  const nav = createNavigationMenu();
  const mainContent = document.createElement("main");
  mainContent.className = "container mx-auto px-4 pt-24 pb-12";

  mainContent.appendChild(content);
  layout.appendChild(nav);
  layout.appendChild(mainContent);

  return layout;
}

// Avatar Component
function createAvatar(imageUrl, firstName, lastName) {
  const avatar = document.createElement("div");
  avatar.className = "avatar h-24 w-24";

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = `${firstName} ${lastName}`;
    img.className = "avatar-image";
    img.onerror = () => {
      img.remove();
      avatar.appendChild(createAvatarFallback(firstName, lastName));
    };
    avatar.appendChild(img);
  } else {
    avatar.appendChild(createAvatarFallback(firstName, lastName));
  }

  return avatar;
}

function createAvatarFallback(firstName, lastName) {
  const fallback = document.createElement("div");
  fallback.className = "avatar-fallback";
  fallback.textContent = `${firstName[0]}${lastName[0]}`;
  return fallback;
}

// Card Component
function createCard(className = "") {
  const card = document.createElement("div");
  card.className = `card ${className}`;
  return card;
}

// Animated Card Component
function createAnimatedCard(delay = 0, className = "") {
  const card = document.createElement("div");
  card.className = `card glass-card card-hover animate-fade-in animation-delay-${delay} ${className}`;
  card.style.opacity = "0";
  return card;
}

// Card Header Component
function createCardHeader(title) {
  const header = document.createElement("div");
  header.className = "card-header";

  const titleElement = document.createElement("h3");
  titleElement.className = "card-title";
  titleElement.textContent = title;

  header.appendChild(titleElement);
  return header;
}

// Card Content Component
function createCardContent() {
  const content = document.createElement("div");
  content.className = "card-content";
  return content;
}

// Spinner Component
function createSpinner(className = "") {
  const spinner = document.createElement("div");
  spinner.className = `loading-spinner ${className}`;
  spinner.setAttribute("role", "status");
  spinner.setAttribute("aria-label", "Loading");
  return spinner;
}

// Line Chart Component
function createLineChart(data, xKey, yKey, width = 100, height = 300) {
  const container = document.createElement("div");
  container.className = "chart-container";

  const svg = createSVG(width, height);

  // Calculate scales
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Find min and max values
  const yValues = data.map((d) => d[yKey]);
  const yMax = Math.max(...yValues) * 1.1; // Add 10% padding

  // Draw axes
  const xAxis = createSVGElement("line");
  xAxis.setAttribute("x1", padding);
  xAxis.setAttribute("y1", height - padding);
  xAxis.setAttribute("x2", width - padding);
  xAxis.setAttribute("y2", height - padding);
  xAxis.setAttribute("stroke", "#ccc");

  const yAxis = createSVGElement("line");
  yAxis.setAttribute("x1", padding);
  yAxis.setAttribute("y1", padding);
  yAxis.setAttribute("x2", padding);
  yAxis.setAttribute("y2", height - padding);
  yAxis.setAttribute("stroke", "#ccc");

  svg.appendChild(xAxis);
  svg.appendChild(yAxis);

  // Draw x-axis labels
  data.forEach((d, i) => {
    const x = padding + i * (chartWidth / (data.length - 1));
    const y = height - padding + 15;

    const text = createSVGElement("text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "12px");
    text.setAttribute("fill", "#666");
    text.textContent = d[xKey];

    svg.appendChild(text);
  });

  // Draw y-axis labels
  for (let i = 0; i <= 4; i++) {
    const y = height - padding - i * (chartHeight / 4);
    const value = Math.round((i * yMax) / 4);

    const text = createSVGElement("text");
    text.setAttribute("x", padding - 10);
    text.setAttribute("y", y + 5);
    text.setAttribute("text-anchor", "end");
    text.setAttribute("font-size", "12px");
    text.setAttribute("fill", "#666");
    text.textContent = value;

    // Grid line
    const gridLine = createSVGElement("line");
    gridLine.setAttribute("x1", padding);
    gridLine.setAttribute("y1", y);
    gridLine.setAttribute("x2", width - padding);
    gridLine.setAttribute("y2", y);
    gridLine.setAttribute("stroke", "#eee");
    gridLine.setAttribute("stroke-dasharray", "3,3");

    svg.appendChild(gridLine);
    svg.appendChild(text);
  }

  // Draw the line
  const linePoints = data
    .map((d, i) => {
      const x = padding + i * (chartWidth / (data.length - 1));
      const y = height - padding - (d[yKey] / yMax) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const line = createSVGElement("polyline");
  line.setAttribute("points", linePoints);
  line.setAttribute("fill", "none");
  line.setAttribute("stroke", "hsl(var(--primary))");
  line.setAttribute("stroke-width", "2");
  line.setAttribute("stroke-linecap", "round");
  line.setAttribute("stroke-linejoin", "round");

  // Animate the line
  requestAnimationFrame(() => {
    const length = line.getTotalLength() || 0;
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;
    line.style.animation = "dash 1.5s ease-in-out forwards";
  });

  // Add animation to the SVG style
  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = `
      @keyframes dash {
        to {
          stroke-dashoffset: 0;
        }
      }
    `;
  svg.appendChild(style);

  // Draw data points
  data.forEach((d, i) => {
    const x = padding + i * (chartWidth / (data.length - 1));
    const y = height - padding - (d[yKey] / yMax) * chartHeight;

    const point = createSVGElement("circle");
    point.setAttribute("cx", x);
    point.setAttribute("cy", y);
    point.setAttribute("r", "4");
    point.setAttribute("fill", "hsl(var(--primary))");
    point.setAttribute("opacity", "0");
    point.style.animation = `fadeIn 0.3s ease-out ${i * 0.1}s forwards`;

    // Tooltip on hover
    point.addEventListener("mouseenter", (e) => {
      const tooltip = createSVGElement("g");
      tooltip.classList.add("chart-tooltip");

      const tooltipRect = createSVGElement("rect");
      tooltipRect.setAttribute("x", x - 50);
      tooltipRect.setAttribute("y", y - 40);
      tooltipRect.setAttribute("width", "100");
      tooltipRect.setAttribute("height", "30");
      tooltipRect.setAttribute("rx", "5");
      tooltipRect.setAttribute("fill", "rgba(0,0,0,0.8)");

      const tooltipText = createSVGElement("text");
      tooltipText.setAttribute("x", x);
      tooltipText.setAttribute("y", y - 20);
      tooltipText.setAttribute("text-anchor", "middle");
      tooltipText.setAttribute("fill", "white");
      tooltipText.setAttribute("font-size", "12px");
      tooltipText.textContent = `${d[xKey]}: ${d[yKey]}`;

      tooltip.appendChild(tooltipRect);
      tooltip.appendChild(tooltipText);
      svg.appendChild(tooltip);

      point.addEventListener("mouseleave", () => {
        svg.removeChild(tooltip);
      });
    });

    svg.appendChild(point);
  });

  svg.appendChild(line);
  container.appendChild(svg);

  return container;
}

// Bar Chart Component
function createBarChart(data, xKey, yKey, width = 100, height = 300) {
  const container = document.createElement("div");
  container.className = "chart-container";

  const svg = createSVG(width, height);

  // Calculate scales
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Find max value
  const yValues = data.map((d) => d[yKey]);
  const yMax = Math.max(...yValues) * 1.1; // Add 10% padding

  // Bar width
  const barWidth = (chartWidth / data.length) * 0.8;
  const barSpacing = (chartWidth / data.length) * 0.2;

  // Draw axes
  const xAxis = createSVGElement("line");
  xAxis.setAttribute("x1", padding);
  xAxis.setAttribute("y1", height - padding);
  xAxis.setAttribute("x2", width - padding);
  xAxis.setAttribute("y2", height - padding);
  xAxis.setAttribute("stroke", "#ccc");

  const yAxis = createSVGElement("line");
  yAxis.setAttribute("x1", padding);
  yAxis.setAttribute("y1", padding);
  yAxis.setAttribute("x2", padding);
  yAxis.setAttribute("y2", height - padding);
  yAxis.setAttribute("stroke", "#ccc");

  svg.appendChild(xAxis);
  svg.appendChild(yAxis);

  // Draw x-axis labels
  data.forEach((d, i) => {
    const x =
      padding + i * (chartWidth / data.length) + chartWidth / data.length / 2;
    const y = height - padding + 15;

    const text = createSVGElement("text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("font-size", "12px");
    text.setAttribute("fill", "#666");
    text.textContent = d[xKey];

    svg.appendChild(text);
  });

  // Draw y-axis labels
  for (let i = 0; i <= 4; i++) {
    const y = height - padding - i * (chartHeight / 4);
    const value = Math.round((i * yMax) / 4);

    const text = createSVGElement("text");
    text.setAttribute("x", padding - 10);
    text.setAttribute("y", y + 5);
    text.setAttribute("text-anchor", "end");
    text.setAttribute("font-size", "12px");
    text.setAttribute("fill", "#666");
    text.textContent = value;

    // Grid line
    const gridLine = createSVGElement("line");
    gridLine.setAttribute("x1", padding);
    gridLine.setAttribute("y1", y);
    gridLine.setAttribute("x2", width - padding);
    gridLine.setAttribute("y2", y);
    gridLine.setAttribute("stroke", "#eee");
    gridLine.setAttribute("stroke-dasharray", "3,3");

    svg.appendChild(gridLine);
    svg.appendChild(text);
  }

  // Draw bars
  data.forEach((d, i) => {
    const barHeight = (d[yKey] / yMax) * chartHeight;
    const x = padding + i * (chartWidth / data.length) + barSpacing / 2;
    const y = height - padding - barHeight;

    const bar = createSVGElement("rect");
    bar.setAttribute("x", x);
    bar.setAttribute("y", height - padding);
    bar.setAttribute("width", barWidth);
    bar.setAttribute("height", 0);
    bar.setAttribute("fill", "hsl(var(--primary))");
    bar.setAttribute("rx", "2");

    // Animation
    bar.style.transition = "y 0.5s ease-out, height 0.5s ease-out";
    bar.style.transitionDelay = `${i * 0.1}s`;

    // Tooltip on hover
    bar.addEventListener("mouseenter", () => {
      const tooltip = createSVGElement("g");
      tooltip.classList.add("chart-tooltip");

      const tooltipRect = createSVGElement("rect");
      tooltipRect.setAttribute("x", x + barWidth / 2 - 50);
      tooltipRect.setAttribute("y", y - 40);
      tooltipRect.setAttribute("width", "100");
      tooltipRect.setAttribute("height", "30");
      tooltipRect.setAttribute("rx", "5");
      tooltipRect.setAttribute("fill", "rgba(0,0,0,0.8)");

      const tooltipText = createSVGElement("text");
      tooltipText.setAttribute("x", x + barWidth / 2);
      tooltipText.setAttribute("y", y - 20);
      tooltipText.setAttribute("text-anchor", "middle");
      tooltipText.setAttribute("fill", "white");
      tooltipText.setAttribute("font-size", "12px");
      tooltipText.textContent = `${d[xKey]}: ${d[yKey]}`;

      tooltip.appendChild(tooltipRect);
      tooltip.appendChild(tooltipText);
      svg.appendChild(tooltip);

      bar.style.opacity = "0.8";

      bar.addEventListener("mouseleave", () => {
        svg.removeChild(tooltip);
        bar.style.opacity = "1";
      });
    });

    svg.appendChild(bar);

    // Animate after append
    setTimeout(() => {
      bar.setAttribute("y", y);
      bar.setAttribute("height", barHeight);
    }, 10);
  });

  container.appendChild(svg);
  return container;
}

// Chart Section Component
function createChartSection(title, type, data, xKey, yKey, className = "") {
  const card = createCard(`glass-card h-400 ${className}`);

  const header = createCardHeader(title);
  const content = createCardContent();
  content.style.height = "300px";

  // Create the chart based on type
  const chartContainer = document.createElement("div");
  chartContainer.style.width = "100%";
  chartContainer.style.height = "100%";

  // Add a wrapper for responsiveness
  const responsiveContainer = document.createElement("div");
  responsiveContainer.style.width = "100%";
  responsiveContainer.style.height = "100%";
  responsiveContainer.style.position = "relative";

  const chart =
    type === "line"
      ? createLineChart(data, xKey, yKey, 600, 300)
      : createBarChart(data, xKey, yKey, 600, 300);

  // Make chart responsive
  const resizeChart = () => {
    const width = responsiveContainer.clientWidth;
    chart.firstChild.setAttribute("width", width);
    chart.firstChild.setAttribute("viewBox", `0 0 ${width} 300`);
  };

  window.addEventListener("resize", resizeChart);
  setTimeout(resizeChart, 100); // Resize after rendering

  responsiveContainer.appendChild(chart);
  chartContainer.appendChild(responsiveContainer);
  content.appendChild(chartContainer);

  card.appendChild(header);
  card.appendChild(content);

  return card;
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
  createLineChart,
  createBarChart,
  createChartSection,
};
