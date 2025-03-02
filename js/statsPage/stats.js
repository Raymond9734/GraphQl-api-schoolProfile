import {
  createLayout,
  createLoadingSpinner,
} from "../components/components.js";
import { getXPOverTime, getProjectXP, getWeeklyActivity } from "./statsApi.js";
import { createChartSection } from "./charts.js";
import { createToast } from "../utils.js";
import { logout } from "../auth/auth.js";

// Render the stats page
async function renderStats() {
  const root = document.getElementById("root");

  // Simple debug output with proper string concatenation
  root.innerHTML = createLoadingSpinner();

  try {
    // Fetch data
    const xpOverTime = await getXPOverTime();
    const projectXP = await getProjectXP();
    const weeklyActivity = await getWeeklyActivity();

    const content = `
        <div class="space-y-8">
          <h1 class="text-3xl font-bold">Statistics</h1>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            ${createChartSection(
              "XP Progress Over Time",
              "line",
              xpOverTime,
              "month",
              "xp",
              "animate-fade-in animation-delay-100"
            )}
            ${createChartSection(
              "Project XP Distribution",
              "bar",
              projectXP,
              "project",
              "xp",
              "animate-fade-in animation-delay-200"
            )}
          </div>
  
          ${createChartSection(
            "Weekly Activity",
            "line",
            weeklyActivity,
            "day",
            "hours",
            "animate-fade-in animation-delay-300"
          )}
        </div>
      `;

    // Update the page content
    root.innerHTML = createLayout(content);
  } catch (error) {
    console.error("Error loading statistics data:", error);
    createToast({
      title: "Error",
      description: "Failed to load statistics data.",
      variant: "destructive",
    });

    // Redirect to login on error
    root.innerHTML = "";
    logout();
  }
}

export { renderStats };
