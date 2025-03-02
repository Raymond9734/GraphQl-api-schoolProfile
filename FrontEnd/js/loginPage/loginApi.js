import { authenticate } from "../auth/auth.js";
import { createToast, navigateTo } from "../utils.js";
import { createSpinner } from "../components/components.js";

export async function handleLoginSubmit(event, submitButton) {
  event.preventDefault();

  const form = event.target;
  const email = form.querySelector("#email").value.trim();
  const password = form.querySelector("#password").value.trim();

  if (!email || !password) {
    createToast({
      title: "Error",
      description: "Please enter both email and password",
      variant: "destructive",
    });
    return;
  }

  submitButton.disabled = true;
  submitButton.innerHTML = createSpinner();

  try {
    await authenticate({ email, password });
    createToast({
      title: "Login successful",
      description: "Welcome back to your school profile!",
    });
    navigateTo("/");
  } catch (error) {
    createToast({
      title: "Login failed",
      description: "Please check your credentials and try again.",
      variant: "destructive",
    });
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Sign In";
  }
}
