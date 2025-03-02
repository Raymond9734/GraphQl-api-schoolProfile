function LoginTemplate() {
  return `
      <div class="auth-container">
        <div class="auth-card glass-effect animate-fade">
          <div class="auth-card__header">
            <h3 class="auth-card__title text-center">Welcome Back</h3>
          </div>
          <div class="auth-card__content">
            <form id="loginForm" class="auth-form">
              <div class="auth-form__field">
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Email" 
                  class="auth-form__input"
                  required
                >
              </div>
              <div class="auth-form__field">
                <input 
                  type="password" 
                  id="password" 
                  placeholder="Password" 
                  class="auth-form__input"
                  required
                >
              </div>
              <button 
                type="submit" 
                class="auth-form__submit-btn btn-primary w-full"
              >
                Sign In
              </button>
            </form>
            <p class="auth-form__help-text text-muted text-center mt-4">
              Demo credentials: demo@school.edu / demo123
            </p>
          </div>
        </div>
      </div>
    `;
}

export { LoginTemplate };
