import { formatNumber, createProgress, extractProjectName } from "../utils.js";
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

function createProfileHeader(user, registrations) {
  const levelThreshold = 5000;
  const currentLevelXP = user.totalXP % levelThreshold;
  const progressValue = (currentLevelXP / levelThreshold) * 100;

  return `
      <div class="profile-header-row">
        <div class="profile-header">
          <div class="profile-header-content">
            <div class="profile-header-main">
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
        </div>
        ${createRegistrationsCard(registrations)}
      </div>
    `;
}

function createRegistrationsCard(registrations) {
  const getBadgeStyle = (startAt, endAt) => {
    const now = new Date();
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (now < startDate) {
      return "background-color: #f0ad4e; color: white;"; // Orange for upcoming
    } else if (now > endDate) {
      return "background-color: #d9534f; color: white;"; // Red for ended
    } else {
      return "background-color: #5cb85c; color: white;"; // Green for active
    }
  };

  const getStatusText = (startAt, endAt) => {
    const now = new Date();
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (now < startDate) {
      return "Upcoming";
    } else if (now > endDate) {
      return "Ended";
    } else {
      return "Active";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return `
    <div class="registrations-card glass-card">
      ${createCardHeader("Event Registrations")}
      <div class="card-content">
        <div class="skills-list scrollable-list">
          ${registrations
            .sort((a, b) => new Date(b.startAt) - new Date(a.startAt))
            .map(
              (reg) => `
            <div class="event-item glass-effect" style="padding: 1rem; margin-bottom: 1rem; border-radius: 0.5rem;">
              <div class="event-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="text-lg font-medium">${reg.object.name}</span>
                <span class="status-badge" style="padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.875rem; ${getBadgeStyle(
                  reg.startAt,
                  reg.endAt
                )}">
                  ${getStatusText(reg.startAt, reg.endAt)}
                </span>
              </div>
              <div class="event-details" style="display: flex; flex-direction: column; gap: 0.5rem;">
                <div class="event-timing registration-timeline">
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                      <span class="timeline-label">Registration Start</span>
                      <span class="timeline-date">${formatDate(
                        reg.startAt
                      )}</span>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                      <span class="timeline-label">Registration End</span>
                      <span class="timeline-date">${formatDate(
                        reg.endAt
                      )}</span>
                    </div>
                  </div>
                  <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                      <span class="timeline-label">Event Start</span>
                      <span class="timeline-date">${formatDate(
                        reg.eventJoinedAt
                      )}</span>
                    </div>
                  </div>
                </div>
                <div class="event-location" style="display: flex; align-items: center; gap: 0.5rem;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>${reg.campus}</span>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
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

              const normalizedGradeOutOfAHundred =
                (normalizedGrade / maxGrade) * 100;

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
