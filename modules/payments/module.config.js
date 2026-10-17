/**
 * Finnova M-RAL - Payments Management Module Configuration
 * Treasury & Capital | Order: 20
 */

(function () {
  if (window.FinnovaNavigation && typeof window.FinnovaNavigation.register === "function") {
    window.FinnovaNavigation.register({
      id: "payments",
      title: "Payments Management",
      shortTitle: "Payments Management",
      category: "Treasury & Capital",
      order: 20,
      path: "modules/placeholder/index.html?module=payments",
      status: "pending",
      badgeText: "Sprint 2",
      badgeClass: "badge-sprint",
      description: "Inbound cash receipts, bank statement reconciliation, automated invoice matching, and remittance advice.",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>`
    });
  }
})();
