import { formatNumber, createProgress,extractProjectName } from "../utils.js";
import { createAvatar, createCardHeader } from "../components/components.js";

function createProfileCards(user, transactions, grades) {
  return `
        <div class="profile-cards-grid">
          <div class="profile-cards-row">
            ${createXPCard(user, transactions)}
            ${createGradesCard(grades)}
          </div>
          ${createActivityCard(transactions)}
        </div>
      `;
}

function createProfileHeader(user, skills) {
  const levelThreshold = 5000;
  const currentLevelXP = user.totalXP % levelThreshold;
  const progressValue = (currentLevelXP / levelThreshold) * 100;

  return `
      <div class="profile-header-row">
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
        ${createSkillsCard(skills)}
      </div>
    `;
}

function createSkillsCard(skills) {
 

  return `
    <div class="skills-card glass-card">
      ${createCardHeader("Skills")}
      <div class="card-content">
        <div class="skills-list">
          ${skills.map(skill => `
            <div class="skill-item">
              <div class="skill-header">
                <span class="text-sm font-medium">${skill.name}</span>
                <span class="text-sm">${skill.progress}%</span>
              </div>
              ${createProgress(skill.progress)}
            </div>
          `).join('')}
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
        <div class="grades-list scrollable-list">
          ${grades
            .map((grade) => {
              // Normalize the grade: If grade > 1, set it to 1
              const normalizedGrade = Math.min(grade.grade, 1);

              // Hard-code maxGrade to 1
              const maxGrade = 1;

              const normalizedGradeOutOfAHundred = (normalizedGrade / maxGrade) * 100;

              

              // Extract project name using the provided function
              const projectName = extractProjectName(grade.path);

              return `
                <div class="grade-item">
                  <div class="grade-header">
                    <span class="text-sm font-medium">${projectName}</span>
                    <span class="text-sm">${normalizedGradeOutOfAHundred}/100</span>
                  </div>
                  ${createProgress((normalizedGrade / maxGrade) * 100)}
                </div>
              `;
            })
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
          <div class="transactions-list scrollable-list">
            ${transactions
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
