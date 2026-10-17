/**
 * Finnova M-RAL - Liquidity Management & Forecasting Module Configuration
 * Treasury & Capital | Order: 40
 */

(function () {
  if (window.FinnovaNavigation && typeof window.FinnovaNavigation.register === "function") {
    window.FinnovaNavigation.register({
      id: "liquidity",
      title: "Liquidity Management & Forecasting",
      shortTitle: "Liquidity Management",
      category: "Treasury & Capital",
      order: 40,
      path: "modules/placeholder/index.html?module=liquidity",
      status: "pending",
      badgeText: "Sprint 2",
      badgeClass: "badge-sprint",
      description: "13-week cash forecasting, funding gap sensitivity models, scenario simulations, and treasury buffer alerts.",
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>`
    });
  }
})();
