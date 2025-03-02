import { createCardHeader } from "../components/components.js";

// Line Chart Component
function createLineChart(data, xKey, yKey, width = 100, height = 300) {
  // Create SVG with viewBox
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate scales
  const yValues = data.map((d) => d[yKey]);
  const yMax = Math.max(...yValues) * 1.1;

  // Generate points for the line
  const points = data
    .map((d, i) => {
      const x = padding + i * (chartWidth / (data.length - 1));
      const y = height - padding - (d[yKey] / yMax) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return `
      <div class="chart">
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="chart__svg">
          <style>
            @keyframes dash {
              to { stroke-dashoffset: 0; }
            }
          </style>
          
          <!-- Axes -->
          <line x1="${padding}" y1="${height - padding}" x2="${
    width - padding
  }" y2="${height - padding}" class="chart__axis" />
          <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${
    height - padding
  }" class="chart__axis" />
          
          <!-- X-axis labels -->
          ${data
            .map((d, i) => {
              const x = padding + i * (chartWidth / (data.length - 1));
              return `
              <text x="${x}" y="${
                height - padding + 15
              }" class="chart__label" text-anchor="middle">${d[xKey]}</text>
            `;
            })
            .join("")}
          
          <!-- Y-axis labels and grid -->
          ${Array.from({ length: 5 }, (_, i) => {
            const y = height - padding - i * (chartHeight / 4);
            const value = Math.round((i * yMax) / 4);
            return `
              <line x1="${padding}" y1="${y}" x2="${
              width - padding
            }" y2="${y}" class="chart__grid" />
              <text x="${padding - 10}" y="${
              y + 5
            }" class="chart__label" text-anchor="end">${value}</text>
            `;
          }).join("")}
          
          <!-- Data line -->
          <polyline points="${points}" class="chart__line" />
          
          <!-- Data points -->
          ${data
            .map((d, i) => {
              const x = padding + i * (chartWidth / (data.length - 1));
              const y = height - padding - (d[yKey] / yMax) * chartHeight;
              return `
              <circle cx="${x}" cy="${y}" r="4" class="chart__point" style="animation-delay: ${
                i * 0.1
              }s">
                <title>${d[xKey]}: ${d[yKey]}</title>
              </circle>
            `;
            })
            .join("")}
        </svg>
      </div>
    `;
}

// Bar Chart Component
function createBarChart(data, xKey, yKey, width = 100, height = 300) {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate scales
  const yValues = data.map((d) => d[yKey]);
  const yMax = Math.max(...yValues) * 1.1;

  // Bar dimensions
  const barWidth = (chartWidth / data.length) * 0.8;
  const barSpacing = (chartWidth / data.length) * 0.2;

  return `
      <div class="chart">
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="chart__svg">
          <!-- Axes -->
          <line x1="${padding}" y1="${height - padding}" x2="${
    width - padding
  }" y2="${height - padding}" class="chart__axis" />
          <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${
    height - padding
  }" class="chart__axis" />
          
          <!-- X-axis labels -->
          ${data
            .map((d, i) => {
              const x =
                padding +
                i * (chartWidth / data.length) +
                chartWidth / data.length / 2;
              return `
              <text x="${x}" y="${
                height - padding + 15
              }" class="chart__label" text-anchor="middle">${d[xKey]}</text>
            `;
            })
            .join("")}
          
          <!-- Y-axis labels and grid -->
          ${Array.from({ length: 5 }, (_, i) => {
            const y = height - padding - i * (chartHeight / 4);
            const value = Math.round((i * yMax) / 4);
            return `
              <line x1="${padding}" y1="${y}" x2="${
              width - padding
            }" y2="${y}" class="chart__grid" />
              <text x="${padding - 10}" y="${
              y + 5
            }" class="chart__label" text-anchor="end">${value}</text>
            `;
          }).join("")}
          
          <!-- Bars -->
          ${data
            .map((d, i) => {
              const barHeight = (d[yKey] / yMax) * chartHeight;
              const x =
                padding + i * (chartWidth / data.length) + barSpacing / 2;
              const y = height - padding - barHeight;
              return `
              <rect 
                x="${x}" 
                y="${height - padding}" 
                width="${barWidth}" 
                height="0" 
                class="chart__bar" 
                style="animation: barGrow 0.5s ease-out ${i * 0.1}s forwards"
                data-target-height="${barHeight}"
              >
                <title>${d[xKey]}: ${d[yKey]}</title>
              </rect>
            `;
            })
            .join("")}
        </svg>
      </div>
    `;
}

// Chart Section Component
function createChartSection(title, type, data, xKey, yKey, className = "") {
  return `
      <div class="card card--glass ${className}" style="height: 400px">
        ${createCardHeader(title)}
        <div class="card__content" style="height: 300px">
          <div class="chart-container">
            <div class="chart-container__responsive">
              ${
                type === "line"
                  ? createLineChart(data, xKey, yKey, 600, 300)
                  : createBarChart(data, xKey, yKey, 600, 300)
              }
            </div>
          </div>
        </div>
      </div>
    `;
}

export { createLineChart, createBarChart, createChartSection };
