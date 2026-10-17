/**
 * Finnova M-RAL - Project-to-Cash Lifecycle Mock Data
 * Indian Enterprise INR Edition
 */

(function () {
  const DATA = {
    moduleId: "project-to-cash",
    title: "Project-to-Cash Lifecycle",
    records: [
      {
        id: "REC-PROJ-01",
        title: "Initial Ledger Entry",
        valueINR: 5000000,
        status: "Active"
      }
    ]
  };

  window.FINNOVA_PROJECT_TO_CASH_DATA = DATA;
})();
