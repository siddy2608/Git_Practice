/**
 * Finnova M-RAL - Collections Management Module Controller
 */

(function () {
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  function formatINR(val) {
    const num = Number(val);
    return isNaN(num) ? "₹0" : inrFormatter.format(num);
  }

  function triggerToast(title, message, type = "info") {
    if (window.parent && window.parent.FinnovaApp && typeof window.parent.FinnovaApp.toast === "function") {
      window.parent.FinnovaApp.toast(title, message, type);
    } else {
      alert(`${title}: ${message}`);
    }
  }

  // Theme Sync
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "THEME_CHANGED") {
      document.documentElement.setAttribute("data-theme", e.data.theme);
    }
  });

  const savedTheme = localStorage.getItem("finnova_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-action-collections");
    if (btn) {
      btn.addEventListener("click", () => {
        triggerToast("Collections Management", "Module action executed successfully in Collections Management.", "success");
      });
    }
  });
})();
