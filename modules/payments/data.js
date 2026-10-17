/**
 * Finnova M-RAL - Payments Management Mock Data
 * Indian Enterprise INR Edition
 */

(function () {
  const DATA = {
    moduleId: "payments",
    title: "Payments Management",
    records: [
      {
        id: "REC-PAYM-01",
        title: "Initial Ledger Entry",
        valueINR: 5000000,
        status: "Active"
      }
    ]
  };

  window.FINNOVA_PAYMENTS_DATA = DATA;
})();
