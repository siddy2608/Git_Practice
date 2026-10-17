/**
 * Finnova M-RAL Prototype - Access & Role Permissions Engine
 * Sprint 1 Base UI Foundation
 * 
 * Enforces role boundaries across the prototype.
 * IMPORTANT: This client-side role check is for prototype demonstration purposes only.
 * In production, authorization must be validated server-side on every request.
 */

(function () {
  const ROLES = {
    ADMIN: "Administrator",
    COMPANY_USER: "Company User",
    PENDING: "Pending"
  };

  const Permissions = {
    ROLES,

    /**
     * Check if a user is permitted to enter the Admin Main Dashboard
     * Acceptance Criterion 5 & 7: Only active Administrator accounts are granted access.
     */
    canAccessAdminDashboard(user) {
      if (!user) return false;
      return user.role === ROLES.ADMIN && user.status === "Active";
    },

    /**
     * Return formatted status badge HTML
     */
    getStatusBadge(status) {
      switch (status) {
        case "Active":
          return `<span class="badge badge-success"><span class="badge-dot"></span>Active</span>`;
        case "Pending Approval":
        case "Pending":
          return `<span class="badge badge-warning"><span class="badge-dot"></span>Pending</span>`;
        case "Inactive":
        case "Suspended":
          return `<span class="badge badge-danger"><span class="badge-dot"></span>Suspended</span>`;
        default:
          return `<span class="badge badge-neutral"><span class="badge-dot"></span>${status || "Unknown"}</span>`;
      }
    },

    /**
     * Return role badge HTML
     */
    getRoleBadge(role) {
      switch (role) {
        case ROLES.ADMIN:
          return `<span class="badge badge-info" style="font-weight: 600;">System Administrator</span>`;
        case ROLES.COMPANY_USER:
          return `<span class="badge badge-neutral">Company User</span>`;
        case ROLES.PENDING:
          return `<span class="badge badge-warning">Pending Approval</span>`;
        default:
          return `<span class="badge badge-neutral">${role || "User"}</span>`;
      }
    }
  };

  // Export to window
  window.FinnovaPermissions = Permissions;
})();
