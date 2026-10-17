/**
 * Finnova M-RAL - Access Management Module Configuration
 * Governance | Order: 10
 */

(function () {
  if (window.FinnovaNavigation && typeof window.FinnovaNavigation.register === "function") {
    window.FinnovaNavigation.register({
      id: "access",
      title: "Access Management",
      shortTitle: "Access Management",
      category: "Governance",
      order: 10,
      path: "modules/placeholder/index.html?module=access",
      status: "pending",
      badgeText: "Sprint 2",
      badgeClass: "badge-sprint",
      description: "User roles, permissions matrix, client portal user provisioning, and authorization audit logs.",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`
    });
  }
})();
