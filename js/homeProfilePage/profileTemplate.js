import { formatNumber, createProgress } from "../utils.js";
import { createAvatar, createCardHeader } from "../components/components.js";

function createProfileCards(user, transactions, grades) {
  return `
        <div class="profile-cards-grid">
          ${createXPCard(user, transactions)}
          ${createGradesCard(grades)}
          ${createActivityCard(transactions)}
        </div>
      `;
}

function createProfileHeader(user) {
  const levelThreshold = 5000;
  const currentLevelXP = user.totalXP % levelThreshold;
  const progressValue = (currentLevelXP / levelThreshold) * 100;

  return `
      <div class="profile-header">
        <div class="profile-header-content">
          ${createAvatar(user.imageUrl, user.firstName, user.lastName)}
          <div class="profile-info">
            <h1 class="profile-name">${user.firstName} ${user.lastName}</h1>
            <p class="profile-email">${user.email}</p>
            <div class="profile-stats">
              <div class="profile-stat">
                <span class="font-bold">${user.country}</span>
              </div>
              <div class="profile-stat">
                Audit Ratio <span class="font-bold">${user.auditRatio}</span>
              </div>
            </div>
            <div class="profile-progress">
              ${createProgress(progressValue)}
            </div>
          </div>
        </div>
      </div>
    `;
}

function createGradesCard(grades) {
  return `
      <div class="grades-card glass-card">
        ${createCardHeader("Recent Grades")}
        <div class="card-content">
          <div class="grades-list">
            ${grades
              .slice(0, 3)
              .map(
                (grade) => `
              <div class="grade-item">
                <div class="grade-header">
                  <span class="text-sm font-medium">${grade.projectName}</span>
                  <span class="text-sm">${grade.grade}/${grade.maxGrade}</span>
                </div>
                ${createProgress((grade.grade / grade.maxGrade) * 100)}
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
}

function createActivityCard(transactions) {
  return `
      <div class="activity-card glass-card">
        ${createCardHeader("Recent Activity")}
        <div class="card-content">
          <div class="activity-list">
            ${transactions
              .slice(0, 4)
              .map(
                (tx) => `
              <div class="activity-item">
                <div>
                  <p class="font-medium">${tx.projectName}</p>
                  <p class="text-sm text-muted-foreground">${new Date(
                    tx.createdAt
                  ).toLocaleDateString()}</p>
                </div>
                <span class="text-sm font-medium text-primary">+${
                  tx.amount
                } XP</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
}

//use transaction table 
function createXPCard(user, transactions) {
  return `
      <div class="xp-card glass-card">
        ${createCardHeader("Experience Points")}
        <div class="card-content">
          <div class="xp-value">${formatNumber(user.totalXP)} XP</div>
          <div class="transactions-list">
            ${transactions
              .slice(0, 3)
              .map(
                (tx) => `
              <div class="transaction-item">
                <span class="text-sm text-muted-foreground">${tx.projectName}</span>
                <span class="font-medium">+${tx.amount} XP</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
}

export {
  createProfileCards,
  createProfileHeader,
  createGradesCard,
  createActivityCard,
  createXPCard,
};
