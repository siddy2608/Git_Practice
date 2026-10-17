/**
 * Finnova M-RAL - Module Logic Controller Template
 * 
 * TODO: Implement interactive behaviors, UI listeners, and data binding here.
 * You can invoke window.parent.FinnovaApp.toast(title, message, type) when hosted in the shell.
 */

(function () {
  // Shared Indian Currency Formatter (INR Lakhs & Crores)
  const inrFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  function formatINR(val) {
    const num = Number(val);
    return isNaN(num) ? "₹0" : inrFormatter.format(num);
  }

  // Cross-frame Toast Helper
  function triggerToast(title, message, type = "info") {
    if (window.parent && window.parent.FinnovaApp && typeof window.parent.FinnovaApp.toast === "function") {
      window.parent.FinnovaApp.toast(title, message, type);
    } else {
      alert(`${title}: ${message}`);
    }
  }

  // Theme Sync Handler (inherits theme from master shell)
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "THEME_CHANGED") {
      document.documentElement.setAttribute("data-theme", e.data.theme);
    }
  });

  const savedTheme = localStorage.getItem("finnova_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  // Initialize interactive elements when DOM is ready
  document.addEventListener("DOMContentLoaded", () => {
    const actionBtn = document.getElementById("btn-template-action");
    if (actionBtn) {
      actionBtn.addEventListener("click", () => {
        triggerToast("Module Action", "Demo action executed from the module iframe.", "success");
      });
    }

    // TODO: Add module event handlers, data rendering, and validations below
  });

  // Expose module utilities if needed
  window.ModuleController = {
    formatINR,
    triggerToast
  };
})();
