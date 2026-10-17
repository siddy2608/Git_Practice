/**
 * Finnova M-RAL Prototype - Form Validation Engine
 * Sprint 1 Base UI Foundation
 * 
 * Provides centralized input validation rules, email format verification,
 * password complexity inspection, and error reporting helpers.
 */

(function () {
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const SPECIAL_CHAR_REGEX = /[!@\u0024%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`₹]/;

  const Validation = {
    /**
     * Verify email string format
     */
    isValidEmail(email) {
      if (!email || typeof email !== "string") return false;
      return EMAIL_REGEX.test(email.trim());
    },

    /**
     * Check if string is non-empty
     */
    isNonEmpty(value) {
      if (value === null || value === undefined) return false;
      return String(value).trim().length > 0;
    },

    /**
     * Inspect password requirements
     */
    checkPassword(password) {
      const val = password || "";
      const results = {
        hasMinLength: val.length >= 8,
        hasUppercase: /[A-Z]/.test(val),
        hasNumber: /[0-9]/.test(val),
        hasSpecial: SPECIAL_CHAR_REGEX.test(val)
      };

      results.isValid =
        results.hasMinLength &&
        results.hasUppercase &&
        results.hasNumber &&
        results.hasSpecial;

      return results;
    },

    /**
     * Verify password match
     */
    doPasswordsMatch(password, confirmPassword) {
      return Boolean(password && confirmPassword && password === confirmPassword);
    },

    /**
     * Set visual error on an input element
     */
    showInputError(inputEl, errorEl, message) {
      if (inputEl) {
        inputEl.classList.add("is-invalid");
        inputEl.classList.remove("is-valid");
        inputEl.setAttribute("aria-invalid", "true");
      }
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = "flex";
      }
    },

    /**
     * Clear visual error on an input element
     */
    clearInputError(inputEl, errorEl) {
      if (inputEl) {
        inputEl.classList.remove("is-invalid");
        inputEl.removeAttribute("aria-invalid");
      }
      if (errorEl) {
        errorEl.textContent = "";
        errorEl.style.display = "none";
      }
    },

    /**
     * Set valid state on an input element
     */
    showInputValid(inputEl, errorEl) {
      this.clearInputError(inputEl, errorEl);
      if (inputEl) {
        inputEl.classList.add("is-valid");
      }
    }
  };

  // Export to window
  window.FinnovaValidation = Validation;
})();
