import { LoginTemplate } from "./loginTemplate.js";
import { handleLoginSubmit } from "./loginApi.js";

// Main render function
function renderLogin() {
  const root = document.getElementById("root");
  root.innerHTML = LoginTemplate();

  const form = document.getElementById("loginForm");
  const submitButton = form.querySelector("button[type='submit']");

  form.addEventListener("submit", (e) => handleLoginSubmit(e, submitButton));
}

export { renderLogin };
