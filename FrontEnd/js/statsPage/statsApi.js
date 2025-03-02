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

function getXPOverTime() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(xpOverTime), 1000);
  });
}

function getProjectXP() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(projectXP), 1000);
  });
}

function getWeeklyActivity() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(weeklyActivity), 1000);
  });
}

export { getXPOverTime, getProjectXP, getWeeklyActivity };
