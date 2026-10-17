/**
 * Finnova M-RAL - Collections Management Module Configuration
 * Treasury & Capital | Order: 10
 */

(function () {
  if (window.FinnovaNavigation && typeof window.FinnovaNavigation.register === "function") {
    window.FinnovaNavigation.register({
      id: "collections",
      title: "Collections Management",
      shortTitle: "Collections Management",
      category: "Treasury & Capital",
      order: 10,
      path: "modules/placeholder/index.html?module=collections",
      status: "pending",
      badgeText: "Sprint 2",
      badgeClass: "badge-sprint",
      description: "Accounts receivable aging, dunning notices, client payment tracking, and disputes resolution.",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="6" x2="12" y2="8"></line><line x1="12" y1="16" x2="12" y2="18"></line></svg>`
    });
  }
})();
