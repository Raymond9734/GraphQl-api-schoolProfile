import { fetchData } from "../auth/auth.js";
import { GetSixMonthsAgoDate ,extractProjectName} from "../utils.js";


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

const date = GetSixMonthsAgoDate();

const gradeQuery = {
  query:`{
    progress(where: { isDone: { _eq: true }, updatedAt: { _gt: "${date}" } }) {
      path
      grade
      isDone
      updatedAt
    }
  }
`};

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

// Function to filter grades, excluding paths containing "checkpoint" or "piscine"
function filterGrades(grades) {
  if (!grades || !Array.isArray(grades)) return [];

  return grades.filter(grade => 
      !grade.path.includes("checkpoint") 
  );
}

// Function to sort grades from newest to oldest based on the "updatedAt" field
function sortGradesByDate(grades) {
  if (!grades || !Array.isArray(grades)) return [];

  return grades.sort((a, b) => {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return dateB - dateA; // Sorts in descending order (newest first)
  });
}

async function getGrades() {
  const gradesData = await fetchData(gradeQuery);

  if (!gradesData || !gradesData.data || !gradesData.data.progress) {
    return [];
  }

  const filteredGrades = filterGrades(gradesData.data.progress); 

  const sortedGrades = sortGradesByDate(filteredGrades);
  return sortedGrades
}

export { getUserData, getXPTransactions, getGrades, getTotalXP };
