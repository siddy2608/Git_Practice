/**
 * Finnova M-RAL Prototype - Master Dashboard Application Shell
 * Sprint 1 Base UI Foundation
 * 
 * Orchestrates layout controls, header actions, dropdown menus,
 * notifications popover, toasts, confirmation modals, and session display.
 */

(function () {
  const App = {
    user: null,

    /**
     * Initialize master application layout
     */
    async init() {
      // 1. Enforce Administrator authentication guard
      this.user = window.FinnovaAuth.requireAdminSession();
      if (!this.user) return; // Redirecting to login.html

      // 2. Render user session in header & sidebar
      this.renderUserSession();

      // 3. Render persistent sidebar navigation after modules are loaded
      const navContainer = document.getElementById("sidebar-nav-container");
      if (navContainer && window.FinnovaNavigation) {
        if (typeof window.FinnovaNavigation.init === "function") {
          await window.FinnovaNavigation.init(navContainer);
        } else {
          window.FinnovaNavigation.renderSidebarNav(navContainer);
          window.FinnovaNavigation.initFromHash();
        }
      }

      // 4. Setup header & layout interaction handlers
      this.setupLayoutControls();
      this.setupNotificationsDropdown();
      this.setupUserDropdown();
      this.setupGlobalSearch();
      this.setupThemeToggle();
      this.setupSpotlightCommandPalette();
      this.setupModalHandlers();

      // 5. Expose toast and modal handlers
      console.info("[Finnova Master Shell] Initialized for:", this.user.fullName);
    },

    /**
     * Render user info in top header and sidebar
     */
    renderUserSession() {
      if (!this.user) return;

      // Header user
      const headerName = document.getElementById("header-user-name");
      const headerAvatar = document.getElementById("header-user-avatar");
      if (headerName) headerName.textContent = this.user.fullName;
      if (headerAvatar) headerAvatar.textContent = this.user.avatarInitials || "AD";

      // Sidebar footer user
      const sideName = document.getElementById("sidebar-user-name");
      const sideRole = document.getElementById("sidebar-user-role");
      const sideAvatar = document.getElementById("sidebar-user-avatar");
      if (sideName) sideName.textContent = this.user.fullName;
      if (sideRole) sideRole.textContent = this.user.role;
      if (sideAvatar) sideAvatar.textContent = this.user.avatarInitials || "AD";
    },

    /**
     * Setup sidebar toggling for desktop and mobile
     */
    setupLayoutControls() {
      const toggleBtn = document.getElementById("sidebar-toggle-btn");
      const mobileBackdrop = document.getElementById("sidebar-mobile-backdrop");

      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          if (window.innerWidth <= 768) {
            document.body.classList.toggle("sidebar-mobile-open");
          } else {
            document.body.classList.toggle("sidebar-collapsed");
          }
        });
      }

      if (mobileBackdrop) {
        mobileBackdrop.addEventListener("click", () => {
          document.body.classList.remove("sidebar-mobile-open");
        });
      }
    },

    /**
     * Notifications Bell Dropdown
     */
    setupNotificationsDropdown() {
      const btn = document.getElementById("btn-notifications");
      const menu = document.getElementById("notifications-menu");
      const list = document.getElementById("notifications-list");
      const markAllBtn = document.getElementById("btn-mark-all-read");
      const countBadge = document.getElementById("notification-badge-count");

      if (!btn || !menu) return;

      // Toggle dropdown
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeAllDropdowns();
        menu.classList.toggle("show");
      });

      // Populate mock notifications
      const shellData = window.FINNOVA_SHELL_DATA || window.FINNOVA_MOCK_DATA;
      const notifs = (shellData && shellData.notifications) || [];
      if (list) {
        list.innerHTML = notifs.map(n => `
          <div class="notification-item ${n.unread ? "unread" : ""}">
            <div class="notification-icon-wrap" style="background: ${n.type === 'success' ? 'var(--color-success-bg)' : n.type === 'warning' ? 'var(--color-warning-bg)' : 'var(--color-info-bg)'}; color: ${n.type === 'success' ? 'var(--color-success)' : n.type === 'warning' ? 'var(--color-warning)' : 'var(--color-info)'}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div class="notification-details">
              <div class="notification-title-line">${n.title}</div>
              <div class="notification-desc-line">${n.desc}</div>
              <div class="notification-time-line">${n.time}</div>
            </div>
          </div>
        `).join("");
      }

      // Mark all read
      if (markAllBtn) {
        markAllBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const items = list.querySelectorAll(".notification-item");
          items.forEach(i => i.classList.remove("unread"));
          if (countBadge) countBadge.style.display = "none";
          this.toast("Notifications Cleared", "All demonstration alerts marked as read.", "info");
        });
      }

      // Close on outside click
      document.addEventListener("click", () => {
        menu.classList.remove("show");
      });

      menu.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    },

    /**
     * User profile dropdown and actions
     */
    setupUserDropdown() {
      const btn = document.getElementById("btn-user-menu");
      const menu = document.getElementById("user-menu-dropdown");
      const logoutBtn = document.getElementById("btn-logout-action");
      const sidebarLogoutBtn = document.getElementById("sidebar-logout-btn");
      const profileModalTrigger = document.getElementById("btn-view-profile");
      const resetDataTrigger = document.getElementById("btn-reset-prototype-data");

      if (!btn || !menu) return;

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeAllDropdowns();
        menu.classList.toggle("show");
      });

      document.addEventListener("click", () => {
        menu.classList.remove("show");
      });

      menu.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      // Logout triggers
      const handleLogout = () => {
        this.openModal("modal-logout-confirm");
      };

      if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
      if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener("click", handleLogout);

      // Confirm Logout inside Modal
      const confirmLogoutBtn = document.getElementById("btn-confirm-logout");
      if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener("click", () => {
          window.FinnovaAuth.logout();
        });
      }

      // Profile details modal trigger
      if (profileModalTrigger) {
        profileModalTrigger.addEventListener("click", () => {
          menu.classList.remove("show");
          this.showProfileModal();
        });
      }

      // Reset prototype data trigger
      if (resetDataTrigger) {
        resetDataTrigger.addEventListener("click", () => {
          menu.classList.remove("show");
          this.openModal("modal-reset-confirm");
        });
      }

      const confirmResetBtn = document.getElementById("btn-confirm-reset");
      if (confirmResetBtn) {
        confirmResetBtn.addEventListener("click", () => {
          window.FinnovaStorage.resetPrototypeData();
          this.closeModal("modal-reset-confirm");
          this.toast("Prototype Reset", "Demonstration data restored to initial state.", "success");
          setTimeout(() => {
            window.location.reload();
          }, 800);
        });
      }
    },

    /**
     * Populate and open Profile Info Modal
     */
    showProfileModal() {
      if (!this.user) return;
      const modal = document.getElementById("modal-profile-details");
      if (!modal) return;

      const nameEl = document.getElementById("modal-prof-name");
      const emailEl = document.getElementById("modal-prof-email");
      const orgEl = document.getElementById("modal-prof-org");
      const roleEl = document.getElementById("modal-prof-role");
      const statusEl = document.getElementById("modal-prof-status");

      if (nameEl) nameEl.textContent = this.user.fullName;
      if (emailEl) emailEl.textContent = this.user.email;
      if (orgEl) orgEl.textContent = this.user.organization || "Finnova Global Solutions Ltd.";
      if (roleEl) roleEl.innerHTML = window.FinnovaPermissions.getRoleBadge(this.user.role);
      if (statusEl) statusEl.innerHTML = window.FinnovaPermissions.getStatusBadge(this.user.status);

      this.openModal("modal-profile-details");
    },

    /**
     * Theme switcher (Dark / Light mode) with FinnovaStorage persistence
     */
    setupThemeToggle() {
      const toggleBtn = document.getElementById("btn-theme-toggle");
      const savedTheme = (window.FinnovaStorage && window.FinnovaStorage.get("finnova_theme")) || 
                          localStorage.getItem("finnova_theme") || "light";
      
      const applyTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        if (theme === "dark") {
          document.body.classList.add("theme-dark");
        } else {
          document.body.classList.remove("theme-dark");
        }

        if (window.FinnovaStorage) {
          window.FinnovaStorage.set("finnova_theme", theme);
        } else {
          localStorage.setItem("finnova_theme", theme);
        }

        // Notify iframe
        const frame = document.getElementById("module-frame");
        if (frame && frame.contentWindow) {
          try {
            frame.contentWindow.postMessage({ type: "THEME_CHANGED", theme }, "*");
          } catch (e) {}
        }
      };

      applyTheme(savedTheme);

      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
          const next = current === "dark" ? "light" : "dark";
          applyTheme(next);
          this.toast(
            next === "dark" ? "Dark Mode Enabled" : "Light Mode Enabled",
            next === "dark" ? "Cyber obsidian slate aesthetic active." : "Clean institutional light mode active.",
            "info"
          );
        });
      }
    },

    /**
     * Spotlight Command Palette (Ctrl + K)
     */
    setupSpotlightCommandPalette() {
      const modal = document.getElementById("modal-command-palette");
      const input = document.getElementById("spotlight-input");
      const resultsContainer = document.getElementById("spotlight-results");
      const globalInput = document.getElementById("global-search-input");

      if (!modal || !input || !resultsContainer) return;

      const openSpotlight = () => {
        modal.classList.add("show");
        input.value = "";
        renderCommands("");
        setTimeout(() => input.focus(), 50);
      };

      const closeSpotlight = () => {
        modal.classList.remove("show");
      };

      if (globalInput) {
        globalInput.addEventListener("focus", (e) => {
          e.preventDefault();
          globalInput.blur();
          openSpotlight();
        });
        globalInput.addEventListener("click", (e) => {
          e.preventDefault();
          openSpotlight();
        });
      }

      // Hotkey Ctrl + K / Cmd + K
      window.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          if (modal.classList.contains("show")) {
            closeSpotlight();
          } else {
            openSpotlight();
          }
        } else if (e.key === "Escape" && modal.classList.contains("show")) {
          closeSpotlight();
        }
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeSpotlight();
      });

      const getCommands = () => {
        const moduleCmds = (window.FinnovaNavigation ? window.FinnovaNavigation.modules : []).map(m => ({
          type: "module",
          id: m.id,
          title: m.title,
          category: m.category || "Module",
          badge: m.status === "ready" ? "Active Module" : "Sprint 2",
          action: () => {
            window.FinnovaNavigation.navigateTo(m.id);
            this.toast("Navigated", `Opened ${m.title}`, "info");
          }
        }));

        const actionCmds = [
          {
            type: "action",
            id: "client-portal",
            title: "Switch to Client Acceptance Portal",
            category: "Platform Bridge",
            badge: "Portal",
            action: () => {
              window.location.href = "client/index.html";
            }
          },
          {
            type: "action",
            id: "toggle-theme",
            title: "Toggle Theme (Light / Dark Cyber Mode)",
            category: "Aesthetics",
            badge: "Theme",
            action: () => {
              const toggleBtn = document.getElementById("btn-theme-toggle");
              if (toggleBtn) toggleBtn.click();
            }
          },
          {
            type: "action",
            id: "export-csv",
            title: "Export Milestone Pipeline to CSV",
            category: "Quick Action",
            badge: "Data",
            action: () => {
              const frame = document.getElementById("module-frame");
              if (frame && frame.contentWindow) {
                try {
                  const exportBtn = frame.contentWindow.document.getElementById("btn-export-csv");
                  if (exportBtn) {
                    exportBtn.click();
                    this.toast("CSV Export", "Milestone pipeline export triggered.", "success");
                    return;
                  }
                } catch(e) {}
              }
              this.toast("Export Ready", "Navigate to Overview to download full CSV.", "info");
            }
          },
          {
            type: "action",
            id: "simulate-liquidity",
            title: "Launch Liquidity & Working Capital Simulator",
            category: "Treasury Tool",
            badge: "Interactive",
            action: () => {
              window.FinnovaNavigation.navigateTo("overview");
              setTimeout(() => {
                const frame = document.getElementById("module-frame");
                if (frame && frame.contentWindow) {
                  try {
                    const simSection = frame.contentWindow.document.getElementById("liquidity-simulator-box");
                    if (simSection) {
                      simSection.scrollIntoView({ behavior: "smooth" });
                      simSection.classList.add("highlight-pulse");
                    }
                  } catch(e) {}
                }
              }, 400);
            }
          },
          {
            type: "action",
            id: "reset-data",
            title: "Reset Prototype Demo Data",
            category: "System Maintenance",
            badge: "Reset",
            action: () => {
              this.openModal("modal-reset-confirm");
            }
          }
        ];

        return [...actionCmds, ...moduleCmds];
      };

      const renderCommands = (filter) => {
        const query = filter.toLowerCase().trim();
        const allCmds = getCommands();
        const filtered = query ? allCmds.filter(c => 
          c.title.toLowerCase().includes(query) || 
          c.category.toLowerCase().includes(query)
        ) : allCmds;

        if (filtered.length === 0) {
          resultsContainer.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.875rem;">
              No matching modules or actions found for "<strong>${filter}</strong>".
            </div>
          `;
          return;
        }

        resultsContainer.innerHTML = filtered.map((c, idx) => `
          <div class="spotlight-item ${idx === 0 ? "is-focused" : ""}" data-idx="${idx}">
            <div class="spotlight-item-left">
              <span class="spotlight-kbd-badge">${c.badge}</span>
              <div>
                <div class="spotlight-item-title">${c.title}</div>
                <div class="spotlight-item-cat">${c.category}</div>
              </div>
            </div>
            <span style="font-size: 0.75rem; color: var(--color-primary-600); font-weight: 500;">Jump ↵</span>
          </div>
        `).join("");

        const itemEls = resultsContainer.querySelectorAll(".spotlight-item");
        itemEls.forEach((el, index) => {
          el.addEventListener("click", () => {
            closeSpotlight();
            filtered[index].action();
          });
        });
      };

      input.addEventListener("input", (e) => {
        renderCommands(e.target.value);
      });

      input.addEventListener("keydown", (e) => {
        const items = resultsContainer.querySelectorAll(".spotlight-item");
        let focusedIndex = Array.from(items).findIndex(i => i.classList.contains("is-focused"));

        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (items.length === 0) return;
          if (focusedIndex >= 0) items[focusedIndex].classList.remove("is-focused");
          focusedIndex = (focusedIndex + 1) % items.length;
          items[focusedIndex].classList.add("is-focused");
          items[focusedIndex].scrollIntoView({ block: "nearest" });
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (items.length === 0) return;
          if (focusedIndex >= 0) items[focusedIndex].classList.remove("is-focused");
          focusedIndex = (focusedIndex - 1 + items.length) % items.length;
          items[focusedIndex].classList.add("is-focused");
          items[focusedIndex].scrollIntoView({ block: "nearest" });
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (focusedIndex >= 0 && items[focusedIndex]) {
            items[focusedIndex].click();
          }
        }
      });
    },

    setupGlobalSearch() {
      // Replaced by setupSpotlightCommandPalette (Ctrl + K)
    },

    /**
     * Close all active dropdown menus
     */
    closeAllDropdowns() {
      const dropdowns = document.querySelectorAll(".dropdown-menu");
      dropdowns.forEach(d => d.classList.remove("show"));
    },

    /**
     * Modal Helpers & Event Listeners
     */
    setupModalHandlers() {
      // 1. Close modal when clicking directly on the backdrop (outside dialog card)
      document.addEventListener("click", (e) => {
        if (e.target && e.target.classList && e.target.classList.contains("modal-backdrop") && e.target.classList.contains("show")) {
          this.closeModal(e.target.id);
        }
      });

      // 2. Close on Escape key
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          const openModals = document.querySelectorAll(".modal-backdrop.show");
          openModals.forEach((m) => this.closeModal(m.id));
        }
      });

      // 3. Close on any button with .modal-close
      document.addEventListener("click", (e) => {
        const closeBtn = e.target.closest(".modal-close");
        if (closeBtn) {
          const modal = closeBtn.closest(".modal-backdrop");
          if (modal) {
            this.closeModal(modal.id);
          }
        }
      });
    },

    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add("show");
        document.body.style.overflow = "hidden";
      }
    },

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove("show");
        document.body.style.overflow = "";
      }
    },

    /**
     * Toast Notification helper
     * @param {string} title 
     * @param {string} message 
     * @param {'success'|'warning'|'danger'|'info'} type 
     * @param {number} durationMs 
     */
    toast(title, message, type = "info", durationMs = 4000) {
      let container = document.getElementById("app-toast-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "app-toast-container";
        container.className = "toast-container";
        document.body.appendChild(container);
      }

      const toastEl = document.createElement("div");
      toastEl.className = `toast toast-${type}`;

      let iconSvg = "";
      if (type === "success") {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      } else if (type === "warning") {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
      } else if (type === "danger") {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
      } else {
        iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-info)" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
      }

      toastEl.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-content">
          <div class="toast-title">${title}</div>
          <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" type="button" aria-label="Close">&times;</button>
      `;

      container.appendChild(toastEl);

      const closeBtn = toastEl.querySelector(".toast-close");
      const removeToast = () => {
        toastEl.style.opacity = "0";
        toastEl.style.transform = "translateX(20px)";
        setTimeout(() => toastEl.remove(), 250);
      };

      if (closeBtn) closeBtn.addEventListener("click", removeToast);
      setTimeout(removeToast, durationMs);
    },

    /**
     * Shared Indian Currency (INR) Formatters
     * Enforces Intl en-IN currency style and Indian digit grouping (Lakhs & Crores)
     */
    formatINR(value) {
      if (value === null || value === undefined || value === "") return "₹0";
      const num = Number(value);
      if (isNaN(num)) return "₹0";
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(num);
    },

    formatINRCompact(value) {
      if (value === null || value === undefined || value === "") return "₹0";
      const num = Number(value);
      if (isNaN(num)) return "₹0";
      const isNegative = num < 0;
      const abs = Math.abs(num);

      if (abs >= 10000000) { // 1 Crore = 10,000,000
        const cr = abs / 10000000;
        const formatted = cr >= 100 ? cr.toFixed(0) : (cr >= 10 ? cr.toFixed(1) : cr.toFixed(2));
        return (isNegative ? "-" : "") + "₹" + parseFloat(formatted) + " Cr";
      } else if (abs >= 100000) { // 1 Lakh = 100,000
        const lk = abs / 100000;
        const formatted = lk >= 100 ? lk.toFixed(0) : (lk >= 10 ? lk.toFixed(1) : lk.toFixed(2));
        return (isNegative ? "-" : "") + "₹" + parseFloat(formatted) + " L";
      } else if (abs >= 1000) {
        const k = abs / 1000;
        const formatted = k >= 10 ? k.toFixed(0) : k.toFixed(1);
        return (isNegative ? "-" : "") + "₹" + parseFloat(formatted) + " K";
      }
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(num);
    }
  };

  // Expose helpers globally for seamless access across all iframe modules
  window.formatINR = App.formatINR;
  window.formatINRCompact = App.formatINRCompact;

  // Export to window
  window.FinnovaApp = App;
})();

