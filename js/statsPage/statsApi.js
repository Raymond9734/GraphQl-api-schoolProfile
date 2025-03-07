import { fetchData } from "../auth/auth.js";
import { extractProjectName } from "../utils.js";
// Project XP distribution
const projectXP = [
  { project: "Web Dev", xp: 2500 },
  { project: "Database", xp: 1800 },
  { project: "Algorithms", xp: 1500 },
  { project: "UI/UX", xp: 1200 },
  { project: "Mobile", xp: 2000 },
];



async function getXPOverTime() {
  const xpTransactionsQuery = {
    query: `{
      transaction(where: { 
        type: { _eq: "xp" },
        createdAt: { _gte: "${new Date().getFullYear()}-01-01" }
      }) {
        amount
        createdAt
      }
    }`,
  };

  try {
    const response = await fetchData(xpTransactionsQuery);
    if (!response || !response.data || !response.data.transaction) {
      return [];
    }

    // Group transactions by month and sum XP
    const monthlyXP = response.data.transaction.reduce((acc, tx) => {
      const date = new Date(tx.createdAt);
      const month = date.toLocaleString("default", { month: "short" });

      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += tx.amount;
      return acc;
    }, {});

    // Convert to array format and ensure all months are included
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();

    return months.slice(0, currentMonth + 1).map((month) => ({
      month,
      xp: monthlyXP[month] || 0,
    }));
  } catch (error) {
    console.error("Error fetching XP over time:", error);
    return [];
  }
}

async function getProjectXP() {
  const projectXPQuery = {
    query: `{
      transaction(
        where: { type: { _eq: "xp" } }
        order_by: { createdAt: desc }
        limit: 5
      ) {
        path
        amount
        createdAt
      }
    }`,
  };

  try {
    const response = await fetchData(projectXPQuery);
    if (!response || !response.data || !response.data.transaction) {
      return [];
    }

    // Process transactions to get project XP data
    const projectXPData = response.data.transaction.map((tx) => ({
      project: extractProjectName(tx.path),
      xp: tx.amount,
    }));

    return projectXPData;
  } catch (error) {
    console.error("Error fetching project XP:", error);
    return [];
  }
}



export { getXPOverTime, getProjectXP };
