/**
 * Finnova M-RAL Prototype - Centralized Navigation & Module Registry
 * Sprint 1 Base UI Foundation
 * 
 * Decentralized Module Architecture:
 * - Modules self-register via `FinnovaNavigation.register(config)` inside `modules/<id>/module.config.js`.
 * - Modules are dynamically ordered by predefined category order, then by `config.order` (in steps of 10).
 * - Navigation initialization awaits all module configs before rendering sidebar navigation and routing.
 */

(function () {
  const CATEGORY_ORDER = [
    "Executive Suite",
    "Governance",
    "Project Operations",
    "Financial Engine",
    "Treasury & Capital"
  ];

  const modules = [];

  function sortModules() {
    modules.sort((a, b) => {
      const catA = CATEGORY_ORDER.indexOf(a.category);
      const catB = CATEGORY_ORDER.indexOf(b.category);
      const orderA = catA === -1 ? 999 : catA;
      const orderB = catB === -1 ? 999 : catB;
      if (orderA !== orderB) return orderA - orderB;
      return (a.order || 0) - (b.order || 0);
    });
  }

  function register(config) {
    if (!config || !config.id) return;
    const existingIndex = modules.findIndex(m => m.id === config.id);
    if (existingIndex >= 0) {
      modules[existingIndex] = Object.assign({}, modules[existingIndex], config);
    } else {
      modules.push(config);
    }
    sortModules();
  }

  // Flush any configs queued before navigation.js loaded
  if (window.FinnovaNavigation && Array.isArray(window.FinnovaNavigation._queue)) {
    window.FinnovaNavigation._queue.forEach(register);
  }

  const Navigation = {
    CATEGORY_ORDER,
    modules,
    currentModuleId: "overview",
    register,
    sortModules,

    /**
     * Initialize navigation: await all configs loaded from registry, then render sidebar and setup routing
     */
    async init(containerEl = document.getElementById("sidebar-nav-container")) {
      if (window.FinnovaModuleRegistry && typeof window.FinnovaModuleRegistry.loadAll === "function") {
        await window.FinnovaModuleRegistry.loadAll();
      }
      this.sortModules();
      if (containerEl) {
        this.renderSidebarNav(containerEl);
      }
      this.initFromHash();
    },

    /**
     * Get module definition by ID
     */
    getModule(id) {
      return this.modules.find((m) => m.id === id) || this.modules[0];
    },

    /**
     * Render the persistent sidebar navigation grouped by category
     */
    renderSidebarNav(containerEl) {
      if (!containerEl) return;

      this.sortModules();

      // Group modules by category adhering to CATEGORY_ORDER
      const categories = {};
      CATEGORY_ORDER.forEach((cat) => {
        categories[cat] = [];
      });

      this.modules.forEach((mod) => {
        const cat = mod.category || "General";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(mod);
      });

      let html = "";
      Object.keys(categories).forEach((catName) => {
        const catModules = categories[catName];
        if (!catModules || catModules.length === 0) return;

        html += `<div class="nav-section-title">${catName}</div>`;
        html += `<ul class="sidebar-nav-list">`;
        catModules.forEach((mod) => {
          const isActive = mod.id === this.currentModuleId;
          html += `
            <li class="sidebar-nav-item">
              <a href="#${mod.id}" 
                 class="sidebar-nav-link ${isActive ? "active" : ""}" 
                 data-module-id="${mod.id}"
                 data-title="${mod.title}"
                 title="${mod.title}">
                <span class="sidebar-nav-icon">${mod.icon || ""}</span>
                <span class="sidebar-nav-label">${mod.shortTitle || mod.title}</span>
              </a>
            </li>
          `;
        });
        html += `</ul>`;
      });

      containerEl.innerHTML = html;

      // Attach click events
      const links = containerEl.querySelectorAll(".sidebar-nav-link");
      links.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const modId = link.getAttribute("data-module-id");
          this.navigateTo(modId);
        });
      });
    },

    /**
     * Navigate to a module by ID
     */
    navigateTo(moduleId, updateHash = true) {
      const mod = this.getModule(moduleId);
      if (!mod) return;
      this.currentModuleId = mod.id;

      // 1. Update active styling in sidebar
      const navLinks = document.querySelectorAll(".sidebar-nav-link");
      navLinks.forEach((link) => {
        if (link.getAttribute("data-module-id") === mod.id) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });

      // 2. Update Header Title & Breadcrumbs
      const headerTitleEl = document.getElementById("header-current-title");
      if (headerTitleEl) {
        headerTitleEl.textContent = mod.title;
      }

      const breadcrumbModuleEl = document.getElementById("breadcrumb-current-module");
      if (breadcrumbModuleEl) {
        breadcrumbModuleEl.textContent = mod.shortTitle || mod.title;
      }

      // 3. Update Iframe Destination
      const frameEl = document.getElementById("module-frame");
      const overlayEl = document.getElementById("iframe-loader");

      if (frameEl) {
        if (overlayEl) overlayEl.classList.add("active");

        frameEl.onload = () => {
          if (overlayEl) overlayEl.classList.remove("active");
        };

        // Fallback timeout to guarantee loader removal
        setTimeout(() => {
          if (overlayEl) overlayEl.classList.remove("active");
        }, 600);

        // Set iframe source with cache-buster parameter to ensure immediate rendering in enterprise environments
        const cacheBuster = (mod.path.includes("?") ? "&" : "?") + "v=" + Date.now();
        frameEl.src = mod.path + cacheBuster;
      }

      // 4. Update browser hash if requested
      if (updateHash) {
        window.location.hash = mod.id;
      }

      // 5. Close mobile drawer if open
      if (document.body.classList.contains("sidebar-mobile-open")) {
        document.body.classList.remove("sidebar-mobile-open");
      }
    },

    /**
     * Initialize navigation from URL hash on first load
     */
    initFromHash() {
      const hash = window.location.hash.replace("#", "").trim();
      if (hash && this.getModule(hash)) {
        this.navigateTo(hash, false);
      } else {
        this.navigateTo("overview", false);
      }

      // Listen for browser forward/back buttons
      window.addEventListener("hashchange", () => {
        const currentHash = window.location.hash.replace("#", "").trim();
        if (currentHash && currentHash !== this.currentModuleId) {
          this.navigateTo(currentHash, false);
        }
      });
    }
  };

  // Export to window
  window.FinnovaNavigation = Navigation;
})();
