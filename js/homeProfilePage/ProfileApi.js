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
        }
    }`,
};

const xpTransactionsQuery = {
  query: `{
          transaction(where: { 
            _and: [
              { type: { _eq: "xp" } },
              { eventId: { _eq: 75 } }
            ]
          }) {
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
    imageUrl: "/images/o1ProfilePhoto.jpeg",
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

async function getRegistrations() {
  const registrationsQuery = {
    query: `{
      registration {
        path
        createdAt
        startAt
        endAt
        eventJoinedAt
        object {
          name
        }
        campus
      }
    }`,
  };

  const data = await fetchData(registrationsQuery);
  return data?.data?.registration || [];
}

export {
  getUserData,
  getXPTransactions,
  getGrades,
  getTotalXP,
  getRegistrations,
};
