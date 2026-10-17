/**
 * Finnova M-RAL - Billing Management Module Configuration
 * Financial Engine | Order: 20
 */

(function () {
  if (window.FinnovaNavigation && typeof window.FinnovaNavigation.register === "function") {
    window.FinnovaNavigation.register({
      id: "billing",
      title: "Billing Management",
      shortTitle: "Billing Management",
      category: "Financial Engine",
      order: 20,
      path: "modules/placeholder/index.html?module=billing",
      status: "pending",
      badgeText: "Sprint 2",
      badgeClass: "badge-sprint",
      description: "Accepted milestone billing triggers, billing schedules, unbilled revenue aging, and draft generation.",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`
    });
  }
})();
