/**
 * Finnova M-RAL - Overview Module Configuration
 * Executive Suite | Order: 10
 */

(function () {
  if (window.FinnovaNavigation && typeof window.FinnovaNavigation.register === "function") {
    window.FinnovaNavigation.register({
      id: "overview",
      title: "Overview & Liquidity Pulse",
      shortTitle: "Overview",
      category: "Executive Suite",
      order: 10,
      path: "modules/overview/index.html",
      status: "ready",
      badgeText: "Ready",
      badgeClass: "badge-ready",
      description: "Executive KPIs, milestone pipeline, cash runway summary, and recent project-to-cash activity.",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`
    });
  }
})();
