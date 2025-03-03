import { fetchData } from "../auth/auth.js";
import {
  GetSixMonthsAgoDate,
  extractProjectName,
  calculateTotalXP,
  filterGrades,
  sortGradesByDate,
  getTotalXP,
} from "../utils.js";

const userDataQuery = {
  query: `{
        user {
            auditRatio
            login
            attrs
            xps {
               amount
            }
        }
    }`,
};

const xpTransactionsQuery = {
  query: `{
        transaction(where: { type: { _eq: "xp" } }) {
          path
          amount
          type
          createdAt
        }
      }`,
};

const date = GetSixMonthsAgoDate();

const gradeQuery = {
  query: `{
    progress(where: { isDone: { _eq: true }, updatedAt: { _gt: "${date}" } }) {
      path
      grade
      isDone
      updatedAt
    }
  }
`,
};

async function getUserData() {
  const data = await fetchData(userDataQuery);

  // Get the latest XP transactions to calculate total XP
  const transactions = await getXPTransactions();
  const totalXP = calculateTotalXP(transactions);

  return {
    firstName: data.data.user[0].attrs.firstName,
    lastName: data.data.user[0].attrs.lastName,
    login: data.data.user[0].login,
    email: data.data.user[0].attrs.email,
    auditRatio: Number(data.data.user[0].auditRatio).toFixed(2),
    imageUrl: "https://i.pravatar.cc/300",
    country: data.data.user[0].attrs.country,
    totalXP: totalXP,
  };
}

async function getXPTransactions() {
  const xpData = await fetchData(xpTransactionsQuery);

  if (!xpData || !xpData.data || !xpData.data.transaction) {
    return [];
  }

  // Process the transactions
  const processedTransactions = processTransactions(xpData.data.transaction);

  return processedTransactions;
}

// Function to process and sort transactions
function processTransactions(transactions) {
  if (!transactions || !Array.isArray(transactions)) return [];

  return transactions
    .map((transaction) => ({
      ...transaction,
      projectName: extractProjectName(transaction.path),
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function getGrades() {
  const gradesData = await fetchData(gradeQuery);

  if (!gradesData || !gradesData.data || !gradesData.data.progress) {
    return [];
  }

  const filteredGrades = filterGrades(gradesData.data.progress);

  const sortedGrades = sortGradesByDate(filteredGrades);
  return sortedGrades;
}

function getSkills() {
  const skills = [
    { name: "Go", progress: 85 },
    { name: "JavaScript", progress: 75 },
    { name: "HTML/CSS", progress: 90 },
    { name: "Docker", progress: 60 },
    { name: "SQL", progress: 70 },
  ];
  return skills;
}

export {
  getUserData,
  getXPTransactions,
  getGrades,
  getTotalXP,
  getSkills,
  xpTransactionsQuery,
};
