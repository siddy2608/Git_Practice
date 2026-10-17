/**
 * Finnova M-RAL - Working Capital Health Module Configuration
 * Treasury & Capital | Order: 30
 */

(function () {
  if (window.FinnovaNavigation && typeof window.FinnovaNavigation.register === "function") {
    window.FinnovaNavigation.register({
      id: "working-capital",
      title: "Working Capital Health",
      shortTitle: "Working Capital",
      category: "Treasury & Capital",
      order: 30,
      path: "modules/placeholder/index.html?module=working-capital",
      status: "pending",
      badgeText: "Sprint 2",
      badgeClass: "badge-sprint",
      description: "DSO, DPO, CCC working capital metrics, cash conversion cycle optimization, and balance sheet indicators.",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`
    });
  }
})();
