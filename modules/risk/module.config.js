/**
 * Finnova M-RAL - Project Risk Management Module Configuration
 * Project Operations | Order: 40
 */

(function () {
  if (window.FinnovaNavigation && typeof window.FinnovaNavigation.register === "function") {
    window.FinnovaNavigation.register({
      id: "risk",
      title: "Project Risk Management",
      shortTitle: "Project Risk",
      category: "Project Operations",
      order: 40,
      path: "modules/placeholder/index.html?module=risk",
      status: "pending",
      badgeText: "Sprint 2",
      badgeClass: "badge-sprint",
      description: "Delivery risk register, mitigation plans, milestone slippage risk, and financial impact scoring.",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
    });
  }
})();
