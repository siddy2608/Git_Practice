/**
 * Finnova M-RAL - Delivery Management Mock Data
 * Indian Enterprise INR Edition
 */

(function () {
  const DATA = {
    moduleId: "delivery",
    title: "Delivery Management",
    records: [
      {
        id: "REC-DELI-01",
        title: "Initial Ledger Entry",
        valueINR: 5000000,
        status: "Active"
      }
    ]
  };

  window.FINNOVA_DELIVERY_DATA = DATA;
})();
