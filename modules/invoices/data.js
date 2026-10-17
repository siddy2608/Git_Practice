/**
 * Finnova M-RAL - Invoice Management Mock Data
 * Indian Enterprise INR Edition
 */

(function () {
  const DATA = {
    moduleId: "invoices",
    title: "Invoice Management",
    records: [
      {
        id: "REC-INVO-01",
        title: "Initial Ledger Entry",
        valueINR: 5000000,
        status: "Active"
      }
    ]
  };

  window.FINNOVA_INVOICES_DATA = DATA;
})();
