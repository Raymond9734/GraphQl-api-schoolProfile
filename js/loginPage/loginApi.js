import { authenticate } from "../auth/auth.js";
import { createToast, navigateTo } from "../utils.js";
import { createSpinner } from "../components/components.js";

export async function handleLoginSubmit(event, submitButton) {
  event.preventDefault();

  const form = event.target;
  const identifier = form.querySelector("#identifier").value.trim();
  const password = form.querySelector("#password").value.trim();

  if (!identifier || !password) {
    createToast({
      title: "Error",
      description: "Please enter both email and password",
      variant: "destructive",
    });
    return;
  }

  submitButton.disabled = true;
  submitButton.innerHTML = createSpinner("spinner--sm");

  try {
    await authenticate({ identifier, password });
    createToast({
      title: "Login successful",
      description: "Welcome back to your school profile!",
    });
    navigateTo("/");
  } catch (error) {
    console.error(error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Sign In";
  }
}
