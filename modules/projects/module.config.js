/**
 * Finnova M-RAL - Project Management Module Configuration
 * Project Operations | Order: 20
 */

(function () {
  if (window.FinnovaNavigation && typeof window.FinnovaNavigation.register === "function") {
    window.FinnovaNavigation.register({
      id: "projects",
      title: "Project Management",
      shortTitle: "Project Management",
      category: "Project Operations",
      order: 20,
      path: "modules/placeholder/index.html?module=projects",
      status: "pending",
      badgeText: "Sprint 2",
      badgeClass: "badge-sprint",
      description: "Project setup, scope breakdown, budget baselines, client stakeholders, and milestone schedules.",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>`
    });
  }
})();
