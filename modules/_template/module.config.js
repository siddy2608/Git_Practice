/**
 * Finnova M-RAL - Module Configuration Template
 * 
 * TODO: Replace the placeholder values below with your module's specific metadata.
 * Once ready for integration, update `status: "ready"` and `path: "modules/<module-id>/index.html"`.
 */

(function () {
  if (!window.FinnovaNavigation || typeof window.FinnovaNavigation.register !== "function") {
    return;
  }

  window.FinnovaNavigation.register({
    // TODO: Unique module identifier (must match folder name in lowercase kebab-case, e.g., 'commercial')
    id: "module-template",

    // TODO: Full descriptive title shown in page header and breadcrumbs
    title: "Module Template Workspace",

    // TODO: Concise title shown in the persistent sidebar navigation
    shortTitle: "Template",

    // TODO: Category grouping in sidebar. Must match one of:
    // "Executive Suite" | "Governance" | "Project Operations" | "Financial Engine" | "Treasury & Capital"
    category: "Project Operations",

    // TODO: Order within category (steps of 10: 10, 20, 30, ...)
    order: 10,

    // TODO: Path to iframe view. Keep placeholder during development, change to "modules/<id>/index.html" when ready
    path: "modules/module-template/index.html",

    // TODO: Status: "pending" | "ready"
    status: "ready",

    // TODO: Badge text and CSS class (e.g., "Ready" with "badge-ready", or "Sprint 2" with "badge-sprint")
    badgeText: "Ready",
    badgeClass: "badge-ready",

    // TODO: Description for spotlight search and hover tooltips
    description: "Template module foundation for independent feature development.",

    // TODO: Inline SVG icon (18x18, stroke currentColor)
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>`
  });
})();
