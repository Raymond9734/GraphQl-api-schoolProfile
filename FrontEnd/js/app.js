// Main application logic

import {
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
} from "./components/components.js";
import {
  createToast,
  navigateTo,
  formatNumber,
  createProgress,
  getDateRange,
} from "./utils.js";
import {
  getUserData,
  getXPTransactions,
  getGrades,
  getXPOverTime,
  getProjectXP,
  getWeeklyActivity,
} from "./mockData.js";
import { authenticate, isAuthenticated, logout } from "./auth/auth.js";

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");

  // Set up router
  window.router = function () {
    const path = window.location.pathname;

    // Clear root element
    while (rootElement.firstChild) {
      rootElement.removeChild(rootElement.firstChild);
    }

    // Route to the appropriate page
    if (path === "/login" || (!isAuthenticated() && path !== "/login")) {
      renderLogin();
    } else if (path === "/" || path === "") {
      renderProfile();
    } else if (path === "/stats") {
      renderStats();
    } else {
      navigateTo("/");
    }
  };

  // Handle browser back/forward navigation
  window.addEventListener("popstate", router);

  // Initial route
  router();
});

// Render the login page
function renderLogin() {
  const root = document.getElementById("root");

  const loginContainer = document.createElement("div");
  loginContainer.className = "login-container";

  const card = document.createElement("div");
  card.className = "card glass-card animate-fade-in login-card";

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";

  const title = document.createElement("h3");
  title.className = "card-title text-center";
  title.textContent = "Welcome Back";

  cardHeader.appendChild(title);

  const cardContent = document.createElement("div");
  cardContent.className = "card-content";

  const form = document.createElement("form");
  form.className = "space-y-4";

  // Email field
  const emailDiv = document.createElement("div");
  emailDiv.className = "space-y-2";

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.placeholder = "Email";
  emailInput.className = "input-field";
  emailInput.id = "email";

  emailDiv.appendChild(emailInput);

  // Password field
  const passwordDiv = document.createElement("div");
  passwordDiv.className = "space-y-2";

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.placeholder = "Password";
  passwordInput.className = "input-field";
  passwordInput.id = "password";

  passwordDiv.appendChild(passwordInput);

  // Submit button
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.className = "w-full btn-primary";
  submitButton.textContent = "Sign In";

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      createToast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = "";
    submitButton.appendChild(createSpinner());

    try {
      await authenticate({ email, password });
      createToast({
        title: "Login successful",
        description: "Welcome back to your school profile!",
      });
      navigateTo("/");
    } catch (error) {
      createToast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Sign In";
    }
  });

  form.appendChild(emailDiv);
  form.appendChild(passwordDiv);
  form.appendChild(submitButton);

  // Demo credentials help text
  const helpText = document.createElement("p");
  helpText.className = "text-sm text-muted-foreground text-center mt-4";
  helpText.textContent = "Demo credentials: demo@school.edu / demo123";

  cardContent.appendChild(form);
  cardContent.appendChild(helpText);

  card.appendChild(cardHeader);
  card.appendChild(cardContent);
  loginContainer.appendChild(card);

  root.appendChild(loginContainer);
}

// Render the profile page
async function renderProfile() {
  const root = document.getElementById("root");

  // Create a loading indicator
  const loading = document.createElement("div");
  loading.className = "flex items-center justify-center min-h-screen";
  loading.appendChild(createSpinner());
  root.appendChild(loading);

  try {
    // Fetch data (using mock data for now)
    const user = await getUserData();
    const transactions = await getXPTransactions();
    const grades = await getGrades();

    // Clear loading indicator
    root.removeChild(loading);

    // Create content container
    const content = document.createElement("div");
    content.className = "space-y-8";

    // Profile Header
    const profileHeader = createCard("glass-card animate-fade-in");
    const profileContent = document.createElement("div");
    profileContent.className = "flex items-center space-x-8 py-6 card-content";

    // Avatar
    const avatar = createAvatar(user.imageUrl, user.firstName, user.lastName);

    // User info
    const userInfo = document.createElement("div");
    userInfo.className = "space-y-2";

    const userName = document.createElement("h1");
    userName.className = "text-2xl font-bold";
    userName.textContent = `${user.firstName} ${user.lastName}`;

    const userEmail = document.createElement("p");
    userEmail.className = "text-muted-foreground";
    userEmail.textContent = user.email;

    const userStats = document.createElement("div");
    userStats.className = "flex items-center space-x-4";

    const userLevel = document.createElement("div");
    userLevel.className = "text-sm";
    userLevel.innerHTML = `Level <span class="font-bold">${user.level}</span>`;

    const userRank = document.createElement("div");
    userRank.className = "text-sm";
    userRank.innerHTML = `Rank <span class="font-bold">#${user.rank}</span>`;

    userStats.appendChild(userLevel);
    userStats.appendChild(userRank);

    // Progress bar
    const progressContainer = document.createElement("div");
    progressContainer.className = "w-64";

    // Calculate progress
    const levelThreshold = 5000; // XP needed per level
    const currentLevelXP = user.totalXP % levelThreshold;
    const progressValue = (currentLevelXP / levelThreshold) * 100;

    progressContainer.appendChild(createProgress(progressValue));

    userInfo.appendChild(userName);
    userInfo.appendChild(userEmail);
    userInfo.appendChild(userStats);
    userInfo.appendChild(progressContainer);

    profileContent.appendChild(avatar);
    profileContent.appendChild(userInfo);
    profileHeader.appendChild(profileContent);

    content.appendChild(profileHeader);

    // Cards Grid
    const cardsGrid = document.createElement("div");
    cardsGrid.className =
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

    // XP Card
    const xpCard = createAnimatedCard(100);
    const xpHeader = createCardHeader("Experience Points");
    const xpContent = createCardContent();

    const xpValue = document.createElement("div");
    xpValue.className = "text-3xl font-bold mb-4";
    xpValue.textContent = `${formatNumber(user.totalXP)} XP`;

    const xpTransactionsList = document.createElement("div");
    xpTransactionsList.className = "space-y-2";

    transactions.slice(0, 3).forEach((tx) => {
      const txItem = document.createElement("div");
      txItem.className = "flex justify-between items-center";

      const projectName = document.createElement("span");
      projectName.className = "text-sm text-muted-foreground";
      projectName.textContent = tx.projectName;

      const amount = document.createElement("span");
      amount.className = "font-medium";
      amount.textContent = `+${tx.amount} XP`;

      txItem.appendChild(projectName);
      txItem.appendChild(amount);

      xpTransactionsList.appendChild(txItem);
    });

    xpContent.appendChild(xpValue);
    xpContent.appendChild(xpTransactionsList);
    xpCard.appendChild(xpHeader);
    xpCard.appendChild(xpContent);

    // Grades Card
    const gradesCard = createAnimatedCard(200);
    const gradesHeader = createCardHeader("Recent Grades");
    const gradesContent = createCardContent();

    const gradesList = document.createElement("div");
    gradesList.className = "space-y-4";

    grades.slice(0, 3).forEach((grade) => {
      const gradeItem = document.createElement("div");

      const gradeHeader = document.createElement("div");
      gradeHeader.className = "flex justify-between items-center mb-2";

      const projectName = document.createElement("span");
      projectName.className = "text-sm font-medium";
      projectName.textContent = grade.projectName;

      const gradeValue = document.createElement("span");
      gradeValue.className = "text-sm";
      gradeValue.textContent = `${grade.grade}/${grade.maxGrade}`;

      gradeHeader.appendChild(projectName);
      gradeHeader.appendChild(gradeValue);

      const progressValue = (grade.grade / grade.maxGrade) * 100;
      const progress = createProgress(progressValue);

      gradeItem.appendChild(gradeHeader);
      gradeItem.appendChild(progress);

      gradesList.appendChild(gradeItem);
    });

    gradesContent.appendChild(gradesList);
    gradesCard.appendChild(gradesHeader);
    gradesCard.appendChild(gradesContent);

    // Activity Card
    const activityCard = createAnimatedCard(300, "md:col-span-2 lg:col-span-1");
    const activityHeader = createCardHeader("Recent Activity");
    const activityContent = createCardContent();

    const activityList = document.createElement("div");
    activityList.className = "space-y-4";

    transactions.slice(0, 4).forEach((tx) => {
      const activityItem = document.createElement("div");
      activityItem.className =
        "flex items-center justify-between border-b last:border-0 pb-2 last:pb-0";

      const activityInfo = document.createElement("div");

      const projectName = document.createElement("p");
      projectName.className = "font-medium";
      projectName.textContent = tx.projectName;

      const date = document.createElement("p");
      date.className = "text-sm text-muted-foreground";
      date.textContent = new Date(tx.createdAt).toLocaleDateString();

      activityInfo.appendChild(projectName);
      activityInfo.appendChild(date);

      const amount = document.createElement("span");
      amount.className = "text-sm font-medium text-primary";
      amount.textContent = `+${tx.amount} XP`;

      activityItem.appendChild(activityInfo);
      activityItem.appendChild(amount);

      activityList.appendChild(activityItem);
    });

    activityContent.appendChild(activityList);
    activityCard.appendChild(activityHeader);
    activityCard.appendChild(activityContent);

    cardsGrid.appendChild(xpCard);
    cardsGrid.appendChild(gradesCard);
    cardsGrid.appendChild(activityCard);

    content.appendChild(cardsGrid);

    // Create layout and add content
    const layout = createLayout(content);
    root.appendChild(layout);
  } catch (error) {
    createToast({
      title: "Error",
      description: "Failed to load profile data.",
      variant: "destructive",
    });
    console.error("Error loading profile data:", error);

    // Clear loading indicator if it exists
    const loadingElement = root.querySelector(
      ".flex.items-center.justify-center.min-h-screen"
    );
    if (loadingElement) {
      root.removeChild(loadingElement);
    }
    logout();
  }
}

// Render the stats page
async function renderStats() {
  const root = document.getElementById("root");

  // Create a loading indicator
  const loading = document.createElement("div");
  loading.className = "flex items-center justify-center min-h-screen";
  loading.appendChild(createSpinner());
  root.appendChild(loading);

  try {
    // Fetch data
    const xpOverTime = await getXPOverTime();
    const projectXP = await getProjectXP();
    const weeklyActivity = await getWeeklyActivity();

    // Create content container
    const content = document.createElement("div");
    content.className = "space-y-8";

    // Page title
    const title = document.createElement("h1");
    title.className = "text-3xl font-bold";
    title.textContent = "Statistics";
    content.appendChild(title);

    // Top charts grid
    const topGrid = document.createElement("div");
    topGrid.className = "grid grid-cols-1 lg:grid-cols-2 gap-8";

    // XP Progress chart
    const xpChart = createChartSection(
      "XP Progress Over Time",
      "line",
      xpOverTime,
      "month",
      "xp",
      "animate-fade-in animation-delay-100"
    );

    // Project XP chart
    const projectChart = createChartSection(
      "Project XP Distribution",
      "bar",
      projectXP,
      "project",
      "xp",
      "animate-fade-in animation-delay-200"
    );

    topGrid.appendChild(xpChart);
    topGrid.appendChild(projectChart);
    content.appendChild(topGrid);

    // Weekly activity chart
    const weeklyChart = createChartSection(
      "Weekly Activity",
      "line",
      weeklyActivity,
      "day",
      "hours",
      "animate-fade-in animation-delay-300"
    );

    content.appendChild(weeklyChart);

    // Clear loading and add content
    root.innerHTML = "";
    const layout = createLayout(content);
    root.appendChild(layout);
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
