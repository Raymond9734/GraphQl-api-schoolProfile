import {
  getUserData,
  getXPTransactions,
  getGrades,
  getSkills,
} from "./ProfileApi.js";
import {
  createLoadingSpinner,
  createLayout,
  setupNavigationEvents,
} from "../components/components.js";
import { createProfileHeader, createProfileCards } from "./profileTemplate.js";
import { createToast, navigateTo } from "../utils.js";

// Render the profile page
async function renderProfile() {
  const root = document.getElementById("root");

  // Show loading state
  root.innerHTML = createLoadingSpinner();

  try {
    const [user, transactions, grades, skills] = await Promise.all([
      getUserData(),
      getXPTransactions(),
      getGrades(),
      getSkills(),
    ]);

    const content = `
        <div class="profile-container">
          ${createProfileHeader(user, skills)}
          ${createProfileCards(user, transactions, grades)}
        </div>
      `;

    const layout = createLayout(content);
    root.innerHTML = layout;
    setupNavigationEvents();
  } catch (error) {
    handleProfileError(error);
  }
}
// Add this function after renderProfile
function handleProfileError(error) {
  console.error("Error loading profile data:", error);
  createToast({
    title: "Error",
    description: "Failed to load profile data. Please try again.",
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

export { renderProfile };
