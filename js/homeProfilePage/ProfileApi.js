import { authenticatedFetch, fetchData } from "../auth/auth.js";
import { GRAPHQL_URL } from "../utils.js";

let totalXP = 0;
// User data
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
// Mock API functions to simulate GraphQL queries
async function getUserData() {
  const data = await fetchData(userDataQuery);
  console.log("Processed data", data);

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

// Function to extract project name from path
function extractProjectName(path) {
  if (!path) return "Unknown Project";
  const pathParts = path.split("/");
  return pathParts[pathParts.length - 1];
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

// Rename getTotalXP to calculateTotalXP and make it synchronous
function calculateTotalXP(transactions) {
  return transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );
}

// Add a new function to get just the total XP
async function getTotalXP() {
  const transactions = await getXPTransactions();
  return calculateTotalXP(transactions);
}

function getGrades() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(grades), 1000);
  });
}

export { getUserData, getXPTransactions, getGrades, getTotalXP };
