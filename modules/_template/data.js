/**
 * Finnova M-RAL - Module Data Template
 * 
 * TODO: Maintain mock and demo data for this module in this file.
 * Avoid modifying shared core data unless adding global system-wide mock accounts.
 */

(function () {
  // TODO: Define your module's mock data models here
  const MODULE_DATA = {
    // Example dataset records operating in Indian Rupees (INR)
    items: [
      {
        id: "REC-001",
        title: "Example Contract Milestone Record",
        valueINR: 4500000,
        status: "Active",
        createdAt: "2026-03-01"
      }
    ]
  };

  // Export to window for access by module controller
  window.MODULE_DATA = MODULE_DATA;
})();
