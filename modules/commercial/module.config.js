/**
 * Finnova M-RAL - Commercial Management Module Configuration
 * Project Operations | Order: 10
 */

(function () {
  if (window.FinnovaNavigation && typeof window.FinnovaNavigation.register === "function") {
    window.FinnovaNavigation.register({
      id: "commercial",
      title: "Commercial Management",
      shortTitle: "Commercial Management",
      category: "Project Operations",
      order: 10,
      path: "modules/placeholder/index.html?module=commercial",
      status: "pending",
      badgeText: "Sprint 2",
      badgeClass: "badge-sprint",
      description: "Client contracts, statements of work (SOW), master service agreements, and commercial billing terms.",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`
    });
  }
})();
