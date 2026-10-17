/**
 * Finnova M-RAL - Billing Management Mock Data
 * Indian Enterprise INR Edition
 */

(function () {
  const DATA = {
    moduleId: "billing",
    title: "Billing Management",
    records: [
      {
        id: "REC-BILL-01",
        title: "Initial Ledger Entry",
        valueINR: 5000000,
        status: "Active"
      }
    ]
  };

  window.FINNOVA_BILLING_DATA = DATA;
})();
