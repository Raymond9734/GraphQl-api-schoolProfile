import {
  createLayout,
  createLoadingSpinner,
  setupNavigationEvents,
} from "../components/components.js";
import { getXPOverTime, getProjectXP, getWeeklyActivity } from "./statsApi.js";
import { createChartSection } from "./charts.js";
import { createToast, navigateTo } from "../utils.js";
import { logout } from "../auth/auth.js";

// Render the stats page
async function renderStats() {
  const root = document.getElementById("root");

  // Simple debug output with proper string concatenation
  root.innerHTML = createLoadingSpinner();

  try {

    const [xpOverTime, projectXP, weeklyActivity] = await Promise.all(
      getXPOverTime(),
      getProjectXP(),
      getWeeklyActivity(),
    )


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
    setupNavigationEvents();
  } catch (error) {
    handleStatError(error)
  }
}

// Add this function after renderProfile
function handleStatError(error) {
  console.error("Error loading stat data:", error);
  createToast({
    title: "Error",
    description: "Failed to load stat data. Please try again.",
    variant: "destructive",
  });

  // Clear the root element
  const root = document.getElementById("root");
  root.innerHTML = "";

  navigateTo("/500");

  // Redirect to login if authentication error
  if (error.message?.includes("authentication") || error.status === 401) {
    logout();
  }
}

export { renderStats };
