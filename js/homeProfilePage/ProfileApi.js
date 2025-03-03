import { authenticatedFetch } from "../auth/auth.js";
import { GRAPHQL_URL } from "../utils.js";

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
// Mock API functions to simulate GraphQL queries
async function getUserData() {
  const data = await fetchUserData();
  console.log("Processed data", data);
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    login: data.username,
    email: data.email,
    auditRatio: Number(data.auditRatio).toFixed(2),
    imageUrl: "https://i.pravatar.cc/300",
    country: data.country,
  };
}

const fetchUserData = async () => {
  const query = {
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

  const response = await authenticatedFetch(GRAPHQL_URL, {
    method: "POST",
    body: JSON.stringify(query),
  });

  const data = await response.json();
  console.log(" original data", data);
  return {
    auditRatio: data.data.user[0].auditRatio,
    username: data.data.user[0].login,
    email: data.data.user[0].attrs.email,
    firstName: data.data.user[0].attrs.firstName,
    lastName: data.data.user[0].attrs.lastName,
    country: data.data.user[0].attrs.country,
    totalXP: data.data.user[0].xps,
  };
};

// const userData1 = await fetchUserData();
// console.log("userData1", userData1);

function getXPTransactions() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(xpTransactions), 1000);
  });
}

function getGrades() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(grades), 1000);
  });
}

export { getUserData, getXPTransactions, getGrades };
