/**
 * Finnova M-RAL - Delivery Management Module Configuration
 * Project Operations | Order: 30
 */

(function () {
  if (window.FinnovaNavigation && typeof window.FinnovaNavigation.register === "function") {
    window.FinnovaNavigation.register({
      id: "delivery",
      title: "Delivery Management",
      shortTitle: "Delivery Management",
      category: "Project Operations",
      order: 30,
      path: "modules/placeholder/index.html?module=delivery",
      status: "pending",
      badgeText: "Sprint 2",
      badgeClass: "badge-sprint",
      description: "Sprint delivery tracking, milestone completion evidence, technical work packages, and sign-off criteria.",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>`
    });
  }
})();
