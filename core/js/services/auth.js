/**
 * Finnova M-RAL Prototype - Authentication & Session Service
 * Sprint 1 Base UI Foundation
 * 
 * Handles user login, registration, password validation, demo session state,
 * and role-based route guard enforcement.
 * 
 * PROTOTYPE DISCLAIMER:
 * This code implements a simulated frontend-only authentication flow for prototype demonstration.
 * It is NOT production-ready authentication. In production, password hashing, token exchange,
 * and authorization must be executed securely on a backend server.
 */

(function () {
  const ROOT_URL = new URL("../../../", document.currentScript.src).href;
  const LOGIN_URL = ROOT_URL + "auth/login.html";
  const HOME_URL = ROOT_URL + "index.html";

  const Auth = {
    ROOT_URL,
    LOGIN_URL,
    HOME_URL,

    /**
     * Authenticate demo user against local browser storage
     */
    login(email, password, rememberMe = false) {
      return new Promise((resolve) => {
        // Simulated network latency (300ms) for realistic UX
        setTimeout(() => {
          if (!window.FinnovaValidation.isValidEmail(email)) {
            return resolve({
              success: false,
              message: "Please enter a valid email address format."
            });
          }

          if (!window.FinnovaValidation.isNonEmpty(password)) {
            return resolve({
              success: false,
              message: "Password is required."
            });
          }

          const users = window.FinnovaStorage.get(window.FinnovaStorage.keys.USERS, []);
          const normalizedEmail = email.trim().toLowerCase();

          const matchedUser = users.find(
            (u) => u.email.toLowerCase() === normalizedEmail
          );

          if (!matchedUser) {
            return resolve({
              success: false,
              message: "No account found matching this email address. Please register or select a pre-seeded demo user."
            });
          }

          if (matchedUser.password !== password) {
            return resolve({
              success: false,
              message: "Incorrect password. (For demo testing: Admin password is Admin@1234, User is User@1234)."
            });
          }

          if (matchedUser.status === "Suspended" || matchedUser.status === "Inactive") {
            return resolve({
              success: false,
              message: "This demonstration account is currently inactive or suspended."
            });
          }

          // Build demo session object
          const sessionUser = {
            id: matchedUser.id,
            email: matchedUser.email,
            fullName: matchedUser.fullName,
            organization: matchedUser.organization,
            role: matchedUser.role,
            status: matchedUser.status,
            avatarInitials: matchedUser.avatarInitials || matchedUser.fullName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2),
            loginAt: new Date().toISOString()
          };

          // Save session
          window.FinnovaStorage.setSession(window.FinnovaStorage.keys.SESSION, sessionUser);
          if (rememberMe) {
            window.FinnovaStorage.set(window.FinnovaStorage.keys.REMEMBERED_EMAIL, matchedUser.email);
            window.FinnovaStorage.set(window.FinnovaStorage.keys.SESSION, sessionUser);
          } else {
            window.FinnovaStorage.remove(window.FinnovaStorage.keys.REMEMBERED_EMAIL);
          }

          // Check Admin role requirement for the master dashboard
          const isAdmin = window.FinnovaPermissions.canAccessAdminDashboard(matchedUser);

          resolve({
            success: true,
            isAdmin,
            user: sessionUser
          });
        }, 300);
      });
    },

    /**
     * Register a new demo user
     */
    register(userData) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const { fullName, email, organization, password, confirmPassword, termsAccepted } = userData;

          // 1. Mandatory field checks
          if (!window.FinnovaValidation.isNonEmpty(fullName)) {
            return resolve({ success: false, field: "fullName", message: "Full name is required." });
          }
          if (!window.FinnovaValidation.isValidEmail(email)) {
            return resolve({ success: false, field: "email", message: "A valid business email address is required." });
          }
          if (!window.FinnovaValidation.isNonEmpty(organization)) {
            return resolve({ success: false, field: "organization", message: "Organization or company name is required." });
          }
          if (!termsAccepted) {
            return resolve({ success: false, field: "termsAccepted", message: "You must accept the demonstration terms to continue." });
          }

          // 2. Duplicate email check
          const users = window.FinnovaStorage.get(window.FinnovaStorage.keys.USERS, []);
          const normalizedEmail = email.trim().toLowerCase();
          const emailExists = users.some(u => u.email.toLowerCase() === normalizedEmail);

          if (emailExists) {
            return resolve({
              success: false,
              field: "email",
              message: "An account with this email address already exists. Please sign in or use another address."
            });
          }

          // 3. Password complexity
          const pwdCheck = window.FinnovaValidation.checkPassword(password);
          if (!pwdCheck.isValid) {
            return resolve({
              success: false,
              field: "password",
              message: "Password does not satisfy all complexity requirements."
            });
          }

          // 4. Password confirmation match
          if (!window.FinnovaValidation.doPasswordsMatch(password, confirmPassword)) {
            return resolve({
              success: false,
              field: "confirmPassword",
              message: "Password and confirmation do not match."
            });
          }

          // 5. Enforce role restrictions (Criterion 5: Public registration CANNOT grant admin privileges)
          // Default role is strictly 'Company User' with 'Pending Approval' status
          const newUser = {
            id: `usr_${Date.now()}`,
            email: email.trim(),
            password: password, // Prototype storage only
            fullName: fullName.trim(),
            organization: organization.trim(),
            role: "Company User", // Non-privileged default role
            status: "Pending Approval", // Requires admin provisioning for access
            avatarInitials: fullName.trim().split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2),
            createdAt: new Date().toISOString()
          };

          users.push(newUser);
          window.FinnovaStorage.set(window.FinnovaStorage.keys.USERS, users);

          resolve({
            success: true,
            user: newUser,
            message: "Registration completed successfully. As a public registrant, your account has been provisioned as a non-privileged Company User (Pending Approval)."
          });
        }, 300);
      });
    },

    /**
     * Get active demo session
     */
    getCurrentSession() {
      // Check sessionStorage first, then fallback to localStorage if remembered
      let session = window.FinnovaStorage.getSession(window.FinnovaStorage.keys.SESSION);
      if (!session) {
        session = window.FinnovaStorage.get(window.FinnovaStorage.keys.SESSION);
      }
      return session;
    },

    /**
     * Logout and clear demo session
     */
    logout() {
      window.FinnovaStorage.removeSession(window.FinnovaStorage.keys.SESSION);
      window.FinnovaStorage.remove(window.FinnovaStorage.keys.SESSION);
      window.location.href = LOGIN_URL + "?reason=logged_out";
    },

    /**
     * Route protection guard for the Admin Main Dashboard
     * Enforces Criteria 6 & 7: Redirects unauthenticated or unauthorized users
     */
    requireAdminSession() {
      const session = this.getCurrentSession();

      if (!session) {
        window.location.href = LOGIN_URL + "?reason=unauthenticated";
        return null;
      }

      if (!window.FinnovaPermissions.canAccessAdminDashboard(session)) {
        window.location.href = LOGIN_URL + "?reason=unauthorized";
        return null;
      }

      return session;
    },

    /**
     * Retrieve remembered email if stored
     */
    getRememberedEmail() {
      return window.FinnovaStorage.get(window.FinnovaStorage.keys.REMEMBERED_EMAIL, "");
    }
  };

  // Export to window
  window.FinnovaAuth = Auth;
})();
