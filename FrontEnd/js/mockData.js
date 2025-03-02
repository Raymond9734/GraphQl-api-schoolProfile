// Mock data for the application

// User data
const userData = {
  firstName: "Jane",
  lastName: "Smith",
  login: "jsmith42",
  email: "demo@school.edu",
  imageUrl: "https://i.pravatar.cc/300",
  totalXP: 12450,
  level: 8,
  rank: 42,
};

// XP transactions
const xpTransactions = [
  {
    id: 1,
    projectName: "Web Development Project",
    amount: 850,
    createdAt: "2023-06-15",
  },
  {
    id: 2,
    projectName: "Database Design",
    amount: 750,
    createdAt: "2023-06-10",
  },
  {
    id: 3,
    projectName: "Algorithm Challenge",
    amount: 500,
    createdAt: "2023-06-05",
  },
  {
    id: 4,
    projectName: "UI/UX Workshop",
    amount: 350,
    createdAt: "2023-05-28",
  },
  {
    id: 5,
    projectName: "Mobile App Development",
    amount: 950,
    createdAt: "2023-05-20",
  },
];

// Grades
const grades = [
  { id: 1, projectName: "Web Development Project", grade: 85, maxGrade: 100 },
  { id: 2, projectName: "Database Design", grade: 92, maxGrade: 100 },
  { id: 3, projectName: "Algorithm Challenge", grade: 78, maxGrade: 100 },
];

// XP progress over time
const xpOverTime = [
  { month: "Jan", xp: 1200 },
  { month: "Feb", xp: 1800 },
  { month: "Mar", xp: 2400 },
  { month: "Apr", xp: 3100 },
  { month: "May", xp: 3800 },
  { month: "Jun", xp: 4700 },
];

// Project XP distribution
const projectXP = [
  { project: "Web Dev", xp: 2500 },
  { project: "Database", xp: 1800 },
  { project: "Algorithms", xp: 1500 },
  { project: "UI/UX", xp: 1200 },
  { project: "Mobile", xp: 2000 },
];

// Weekly activity
const weeklyActivity = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 4.5 },
  { day: "Thu", hours: 3.8 },
  { day: "Fri", hours: 5.1 },
  { day: "Sat", hours: 1.2 },
  { day: "Sun", hours: 0.5 },
];

// Mock API functions to simulate GraphQL queries
function getUserData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(userData), 500);
  });
}

function getXPTransactions() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(xpTransactions), 500);
  });
}

function getGrades() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(grades), 500);
  });
}

function getXPOverTime() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(xpOverTime), 500);
  });
}

function getProjectXP() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(projectXP), 500);
  });
}

function getWeeklyActivity() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(weeklyActivity), 500);
  });
}

export {
  getUserData,
  getXPTransactions,
  getGrades,
  getXPOverTime,
  getProjectXP,
  getWeeklyActivity,
};
