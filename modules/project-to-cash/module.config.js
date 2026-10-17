/**
 * Finnova M-RAL - Project-to-Cash Lifecycle Module Configuration
 * Financial Engine | Order: 10
 */

(function () {
  if (window.FinnovaNavigation && typeof window.FinnovaNavigation.register === "function") {
    window.FinnovaNavigation.register({
      id: "project-to-cash",
      title: "Project-to-Cash Lifecycle",
      shortTitle: "Project-to-Cash",
      category: "Financial Engine",
      order: 10,
      path: "modules/placeholder/index.html?module=project-to-cash",
      status: "pending",
      badgeText: "Sprint 2",
      badgeClass: "badge-sprint",
      description: "End-to-end pipeline visibility from milestone delivery to bank cash realization and revenue recognition.",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
    });
  }
})();
