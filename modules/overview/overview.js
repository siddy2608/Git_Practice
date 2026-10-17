(function() {
      // 1. Shared INR Formatting Functions (Strictly Indian Currency: Lakhs & Crores)
      const inrFormatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      });

      function formatINR(value) {
        if (value === null || value === undefined || value === "") return "₹0";
        const num = Number(value);
        if (isNaN(num)) return "₹0";
        return inrFormatter.format(num);
      }

      function formatINRCompact(value) {
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
        return inrFormatter.format(num);
      }

      // Expose to window for inline calls
      window.formatINR = formatINR;
      window.formatINRCompact = formatINRCompact;

      // 2. Realistic Milestone Dataset (Loaded from data.js)
      const MILESTONES = (window.OVERVIEW_DATA && window.OVERVIEW_DATA.milestones) || [
        {
          id: "M-402",
          project: "Tata Omnichannel Cloud Migration",
          client: "Tata Digital Enterprises (Mumbai)",
          deliverable: "Core Database Cutover & GST Audit",
          valueINR: 8500000,
          stage: 2, // 1: Readiness, 2: Review, 3: Accepted/Billing, 4: Released
          readiness: "Ready",
          acceptance: "Awaiting Client Sign-Off",
          billing: "Pending Acceptance",
          statusType: "ACTION",
          evidenceFiles: 4
        },
        {
          id: "M-301",
          project: "HDFC Core Banking API Upgrade",
          client: "HDFC Banking Solutions (Mumbai)",
          deliverable: "NEFT/RTGS Clearing Gateway Test",
          valueINR: 12500000,
          stage: 3,
          readiness: "Ready",
          acceptance: "Client Accepted",
          billing: "Ready to Bill",
          statusType: "READY",
          evidenceFiles: 5
        },
        {
          id: "M-204",
          project: "Reliance Supply Chain ERP Integration",
          client: "Reliance Retail Logistics (Navi Mumbai)",
          deliverable: "Automated Customs & E-Way Bill API",
          valueINR: 4200000,
          stage: 1,
          readiness: "In Review",
          acceptance: "Prerequisites Open",
          billing: "Unearned",
          statusType: "ACTION",
          evidenceFiles: 2
        },
        {
          id: "M-501",
          project: "Infosys Healthcare Compliance Portal",
          client: "Infosys Health Systems (Bengaluru)",
          deliverable: "DISHA & HIPAA Security Sign-Off",
          valueINR: 6400000,
          stage: 1,
          readiness: "At Risk",
          acceptance: "Exception Escalated",
          billing: "Hold",
          statusType: "RISK",
          evidenceFiles: 1
        },
        {
          id: "M-103",
          project: "Mahindra Smart Grid IoT Telemetry",
          client: "Mahindra Power Utilities (Pune)",
          deliverable: "SCADA Integration Pilot",
          valueINR: 9800000,
          stage: 3,
          readiness: "Ready",
          acceptance: "Client Accepted",
          billing: "Ready to Bill",
          statusType: "READY",
          evidenceFiles: 6
        },
        {
          id: "M-104",
          project: "Wipro Cloud Services",
          client: "Wipro Cloud Services (Hyderabad)",
          deliverable: "Aadhaar & SAML Auth Gateway",
          valueINR: 3500000,
          stage: 4,
          readiness: "Ready",
          acceptance: "Client Accepted",
          billing: "Invoiced & Released",
          statusType: "ACCEPTED",
          evidenceFiles: 3
        },
        {
          id: "M-302",
          project: "L&T NBFC Loan Origination Engine",
          client: "L&T Financial Services (Chennai)",
          deliverable: "RBI Mandate & NACH Rail",
          valueINR: 11000000,
          stage: 2,
          readiness: "Ready",
          acceptance: "Awaiting Client Sign-Off",
          billing: "Pending Acceptance",
          statusType: "ACTION",
          evidenceFiles: 4
        },
        {
          id: "M-205",
          project: "Bajaj Dealer Management ERP",
          client: "Bajaj Auto Logistics (Pune)",
          deliverable: "Warehouse Telemetry Stream",
          valueINR: 2800000,
          stage: 4,
          readiness: "Ready",
          acceptance: "Client Accepted",
          billing: "Invoiced & Released",
          statusType: "ACCEPTED",
          evidenceFiles: 3
        },
        {
          id: "M-601",
          project: "Adani Real-Time Treasury Analytics",
          client: "Adani Capital Advisory (Ahmedabad)",
          deliverable: "Algorithmic Working Capital Engine",
          valueINR: 7200000,
          stage: 2,
          readiness: "Ready",
          acceptance: "Awaiting Client Sign-Off",
          billing: "Pending Acceptance",
          statusType: "ACTION",
          evidenceFiles: 4
        },
        {
          id: "M-602",
          project: "Kotak Institutional Custody Suite",
          client: "Kotak Securities & Wealth (Mumbai)",
          deliverable: "Real-Time SEBI Ledger Reconciler",
          valueINR: 5200000,
          stage: 3,
          readiness: "Ready",
          acceptance: "Client Accepted",
          billing: "Ready to Bill",
          statusType: "READY",
          evidenceFiles: 5
        }
      ];

      let activeFilter = "ALL";
      let activeDrawerMilestone = null;

      // 3. Toast Helper
      function showToast(msg, icon = "✓") {
        const container = document.getElementById("toast-container");
        if (!container) return;
        const toast = document.createElement("div");
        toast.className = "mini-toast";
        toast.innerHTML = `<span style="font-weight: bold; color: var(--color-primary-interactive);">${icon}</span> <span>${msg}</span>`;
        container.appendChild(toast);
        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateY(10px)";
          setTimeout(() => toast.remove(), 250);
        }, 3200);
      }

      // 4. Canonical Status Badge HTML Generator
      function getStatusBadgeHtml(statusText) {
        const text = (statusText || "").trim();
        let badgeClass = "status-unearned";
        let iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"></circle></svg>`;

        if (text === "Ready") {
          badgeClass = "status-ready";
          iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (text === "In Review" || text.includes("Review")) {
          badgeClass = "status-in-review";
          iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>`;
        } else if (text.includes("Awaiting") || text.includes("Pending Acceptance")) {
          badgeClass = "status-awaiting-sign-off";
          iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        } else if (text.includes("Blocked") || text.includes("Escalated") || text.includes("At Risk") || text.includes("Hold")) {
          badgeClass = "status-at-risk";
          iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        } else if (text.includes("Accepted")) {
          badgeClass = "status-client-accepted";
          iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
        } else if (text === "Ready to Bill") {
          badgeClass = "status-ready-to-bill";
          iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`;
        } else if (text.includes("Invoiced") || text.includes("Released")) {
          badgeClass = "status-client-accepted";
          iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`;
        }

        return `<span class="status-badge ${badgeClass}">${iconSvg}<span>${text}</span></span>`;
      }

      // 5. Render Table with fixed columns, tooltips, and empty state
      function renderTable() {
        const tbody = document.getElementById("milestones-tbody");
        const emptyState = document.getElementById("table-empty-state");
        const table = document.getElementById("milestones-table");
        const searchVal = document.getElementById("table-search-input").value.toLowerCase().trim();

        const filtered = MILESTONES.filter(m => {
          // Status filter
          if (activeFilter === "ACTION" && m.statusType !== "ACTION") return false;
          if (activeFilter === "READY" && m.statusType !== "READY") return false;
          if (activeFilter === "RISK" && m.statusType !== "RISK") return false;
          if (activeFilter === "ACCEPTED" && m.statusType !== "ACCEPTED" && m.statusType !== "READY") return false;

          // Search filter
          if (searchVal) {
            const match = m.id.toLowerCase().includes(searchVal) ||
                          m.project.toLowerCase().includes(searchVal) ||
                          m.client.toLowerCase().includes(searchVal) ||
                          m.deliverable.toLowerCase().includes(searchVal);
            if (!match) return false;
          }
          return true;
        });

        if (filtered.length === 0) {
          tbody.innerHTML = "";
          emptyState.style.display = "flex";
          table.style.display = "none";
          return;
        }

        emptyState.style.display = "none";
        table.style.display = "table";

        tbody.innerHTML = filtered.map(m => {
          const clientInitials = m.client.split(" ").map(w => w[0]).slice(0, 2).join("");

          return `
            <tr data-id="${m.id}">
              <td style="font-family: var(--font-family-mono); font-weight: 700;">
                <span class="badge bg-light text-dark border">${m.id}</span>
              </td>
              <td title="${m.client} - ${m.project}">
                <div style="display: flex; align-items: center; overflow: hidden;">
                  <span class="client-avatar-badge">${clientInitials}</span>
                  <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    <div style="font-weight: 600; overflow: hidden; text-overflow: ellipsis;">${m.client}</div>
                    <div style="font-size: 0.71875rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis;">${m.project}</div>
                  </div>
                </div>
              </td>
              <td title="${m.deliverable}">
                <div style="font-weight: 500; overflow: hidden; text-overflow: ellipsis;">${m.deliverable}</div>
                <div style="font-size: 0.6875rem; color: var(--text-muted);">${m.evidenceFiles} Verification Artifacts</div>
              </td>
              <td style="font-weight: 700; color: var(--text-primary); font-variant-numeric: tabular-nums; text-align: right;">
                ${formatINR(m.valueINR)}
              </td>
              <td>
                ${getStatusBadgeHtml(m.readiness)}
              </td>
              <td>
                ${getStatusBadgeHtml(m.acceptance)}
              </td>
              <td>
                ${getStatusBadgeHtml(m.billing)}
              </td>
              <td style="text-align: center;">
                <button type="button" class="btn-inspect-action btn-inspect" data-id="${m.id}" title="Inspect milestone proofs and sign off">
                  <span>Inspect</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </td>
            </tr>
          `;
        }).join("");

        // Attach click listeners to rows and buttons
        tbody.querySelectorAll("tr").forEach(row => {
          row.addEventListener("click", () => {
            const mId = row.getAttribute("data-id");
            openDrawer(mId);
          });
        });

        tbody.querySelectorAll(".btn-inspect").forEach(btn => {
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const mId = btn.getAttribute("data-id");
            openDrawer(mId);
          });
        });
      }

      // 6. Render Skeleton Rows during Sync
      function renderTableSkeleton() {
        const tbody = document.getElementById("milestones-tbody");
        tbody.innerHTML = Array(5).fill(0).map(() => `
          <tr>
            <td><div class="skeleton-shimmer skeleton-table-cell" style="width: 60px;"></div></td>
            <td>
              <div class="skeleton-shimmer skeleton-table-cell" style="width: 140px; margin-bottom: 4px;"></div>
              <div class="skeleton-shimmer skeleton-table-cell" style="width: 90px; height: 12px;"></div>
            </td>
            <td>
              <div class="skeleton-shimmer skeleton-table-cell" style="width: 180px; margin-bottom: 4px;"></div>
              <div class="skeleton-shimmer skeleton-table-cell" style="width: 100px; height: 12px;"></div>
            </td>
            <td style="text-align: right;"><div class="skeleton-shimmer skeleton-table-cell" style="width: 80px; margin-left: auto;"></div></td>
            <td><div class="skeleton-shimmer skeleton-table-cell" style="width: 90px;"></div></td>
            <td><div class="skeleton-shimmer skeleton-table-cell" style="width: 110px;"></div></td>
            <td><div class="skeleton-shimmer skeleton-table-cell" style="width: 95px;"></div></td>
            <td style="text-align: center;"><div class="skeleton-shimmer skeleton-table-cell" style="width: 65px; margin: 0 auto;"></div></td>
          </tr>
        `).join("");
      }

      // 7. Render Kanban Pipeline Board
      function renderKanban() {
        const cols = {
          1: document.getElementById("k-items-1"),
          2: document.getElementById("k-items-2"),
          3: document.getElementById("k-items-3"),
          4: document.getElementById("k-items-4")
        };

        const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
        Object.values(cols).forEach(c => { if (c) c.innerHTML = ""; });

        MILESTONES.forEach(m => {
          counts[m.stage]++;
          const card = document.createElement("div");
          card.className = "kanban-item-card";
          card.innerHTML = `
            <div class="k-card-top">
              <span style="font-family: var(--font-family-mono); font-size: 0.6875rem; font-weight: 700; color: var(--text-muted);">${m.id}</span>
              <span class="badge ${m.stage >= 3 ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"}" style="font-size: 0.625rem;">Stage ${m.stage}</span>
            </div>
            <div class="k-card-title" title="${m.deliverable}">${m.deliverable}</div>
            <div class="k-card-client">${m.client}</div>
            <div class="k-card-footer">
              <span class="k-card-val">${formatINRCompact(m.valueINR)}</span>
              <span style="font-size: 0.6875rem; color: var(--color-primary-600); font-weight: 600;">Inspect ↗</span>
            </div>
          `;
          card.addEventListener("click", () => openDrawer(m.id));
          if (cols[m.stage]) cols[m.stage].appendChild(card);
        });

        document.getElementById("k-count-1").textContent = counts[1];
        document.getElementById("k-count-2").textContent = counts[2];
        document.getElementById("k-count-3").textContent = counts[3];
        document.getElementById("k-count-4").textContent = counts[4];
      }

      // 8. Slide-Over Inspection Drawer Logic
      function openDrawer(milestoneId) {
        const m = MILESTONES.find(item => item.id === milestoneId);
        if (!m) return;
        activeDrawerMilestone = m;

        document.getElementById("drawer-code").textContent = m.id;
        document.getElementById("drawer-title").textContent = m.deliverable;
        document.getElementById("drawer-value").textContent = formatINR(m.valueINR);
        document.getElementById("drawer-client").textContent = m.client;

        const isAccepted = m.stage >= 3;
        const checkClientSign = document.getElementById("check-client-sign");
        checkClientSign.checked = isAccepted;
        document.getElementById("btn-drawer-approve").textContent = isAccepted ? "✓ Already Signed & Approved" : "✓ Digital Sign-Off & Approve";

        document.getElementById("milestone-drawer").classList.add("show");
      }

      function closeDrawer() {
        document.getElementById("milestone-drawer").classList.remove("show");
        activeDrawerMilestone = null;
      }

      document.getElementById("btn-close-drawer").addEventListener("click", closeDrawer);
      document.getElementById("milestone-drawer").addEventListener("click", (e) => {
        if (e.target === document.getElementById("milestone-drawer")) closeDrawer();
      });

      // Approve Milestone in Drawer
      document.getElementById("btn-drawer-approve").addEventListener("click", () => {
        if (!activeDrawerMilestone) return;
        activeDrawerMilestone.stage = 3;
        activeDrawerMilestone.acceptance = "Client Accepted";
        activeDrawerMilestone.billing = "Ready to Bill";
        activeDrawerMilestone.statusType = "READY";
        document.getElementById("check-client-sign").checked = true;

        showToast(`${activeDrawerMilestone.id} signed & accepted! (${formatINRCompact(activeDrawerMilestone.valueINR)}) Unlocked for GST billing release.`);
        closeDrawer();
        renderTable();
        renderKanban();
      });

      document.getElementById("btn-drawer-audit-pack").addEventListener("click", () => {
        showToast("Audit Evidence Pack downloaded (ZIP archive verified).");
      });

      // 9. Interactive Simulator with Animated Transitions
      const simSlider = document.getElementById("sim-slider");

      function updateSimulator(val) {
        document.getElementById("slider-percentage-display").textContent = `${val}% Sign-off Velocity`;
        
        // Realistic INR calculations based on slider percentage
        const ratio = val / 100;
        const baselineCash = 24500000;  // ₹2.45 Cr
        const maxCash = 73000000;       // ₹7.30 Cr
        const simCash = Math.round(baselineCash + (maxCash - baselineCash) * ratio);

        const baselineDSO = 38.5;
        const minDSO = 19.2;
        const simDSO = baselineDSO - (baselineDSO - minDSO) * ratio;

        const baselineCCC = 36.6;
        const simCCC = baselineCCC - (18.4 * ratio);

        const baselineCushion = 41500000; // ₹4.15 Cr
        const simCushion = Math.round(baselineCushion + (43500000 * ratio));

        // Animated displays
        document.getElementById("sim-val-cash").textContent = formatINR(simCash);
        document.getElementById("sim-delta-cash").textContent = `↑ +${formatINRCompact(simCash - baselineCash)} vs baseline`;

        document.getElementById("sim-val-dso").textContent = `${simDSO.toFixed(1)} Days`;
        document.getElementById("sim-delta-dso").textContent = `↓ -${(baselineDSO - simDSO).toFixed(1)} Days turnaround`;

        document.getElementById("sim-val-ccc").textContent = `${simCCC.toFixed(1)} Days`;
        document.getElementById("sim-delta-ccc").textContent = `↓ -${(baselineCCC - simCCC).toFixed(1)} Days improvement`;

        document.getElementById("sim-val-cushion").textContent = `+${formatINR(simCushion)}`;
        document.getElementById("sim-delta-cushion").textContent = `↑ Zero deficit guarantee`;
      }

      simSlider.addEventListener("input", (e) => {
        updateSimulator(parseInt(e.target.value, 10));
      });

      document.getElementById("btn-sim-reset").addEventListener("click", () => {
        simSlider.value = 50;
        updateSimulator(50);
        showToast("Simulator restored to 50% baseline.");
      });

      document.getElementById("btn-sim-apply").addEventListener("click", () => {
        // Accelerate pending milestones to Ready
        let acceleratedCount = 0;
        let acceleratedVal = 0;
        MILESTONES.forEach(m => {
          if (m.stage === 2) {
            m.stage = 3;
            m.acceptance = "Client Accepted";
            m.billing = "Ready to Bill";
            m.statusType = "READY";
            acceleratedCount++;
            acceleratedVal += m.valueINR;
          }
        });
        renderTable();
        renderKanban();
        showToast(`⚡ Applied scenario! ${acceleratedCount} milestones accelerated to 'Ready to Bill' (+${formatINRCompact(acceleratedVal)} unlocked).`);
      });

      // 10. View Switcher: Table vs Kanban
      const btnViewTable = document.getElementById("btn-view-table");
      const btnViewKanban = document.getElementById("btn-view-kanban");
      const tableView = document.getElementById("ledger-table-view");
      const kanbanView = document.getElementById("pipeline-kanban-view");

      btnViewTable.addEventListener("click", () => {
        btnViewTable.classList.add("active");
        btnViewKanban.classList.remove("active");
        tableView.style.display = "block";
        kanbanView.style.display = "none";
      });

      btnViewKanban.addEventListener("click", () => {
        btnViewKanban.classList.add("active");
        btnViewTable.classList.remove("active");
        tableView.style.display = "none";
        kanbanView.style.display = "grid";
        renderKanban();
      });

      // 11. Category Filter Chips
      document.querySelectorAll(".filter-chip-btn").forEach(chip => {
        chip.addEventListener("click", () => {
          document.querySelectorAll(".filter-chip-btn").forEach(c => c.classList.remove("active"));
          chip.classList.add("active");
          activeFilter = chip.getAttribute("data-filter");
          renderTable();
        });
      });

      // 12. Instant Search Input
      const searchInput = document.getElementById("table-search-input");
      searchInput.addEventListener("input", renderTable);

      document.getElementById("btn-clear-table-search").addEventListener("click", () => {
        searchInput.value = "";
        activeFilter = "ALL";
        document.querySelectorAll(".filter-chip-btn").forEach(c => c.classList.remove("active"));
        document.querySelector('[data-filter="ALL"]').classList.add("active");
        renderTable();
      });

      // 13. KPI Cards Click-to-Filter
      document.querySelectorAll(".interactive-kpi-card").forEach(card => {
        card.addEventListener("click", () => {
          document.querySelectorAll(".interactive-kpi-card").forEach(c => c.classList.remove("is-selected"));
          card.classList.add("is-selected");
          const metric = card.getAttribute("data-metric");
          if (metric === "BILLING" || metric === "READY") {
            activeFilter = "READY";
          } else if (metric === "ACCEPTANCE") {
            activeFilter = "ACTION";
          } else if (metric === "OVERDUE") {
            activeFilter = "RISK";
          } else {
            activeFilter = "ALL";
          }
          
          document.querySelectorAll(".filter-chip-btn").forEach(c => {
            if (c.getAttribute("data-filter") === activeFilter) {
              c.classList.add("active");
            } else {
              c.classList.remove("active");
            }
          });
          renderTable();
          showToast(`Filtering ledger by ${metric}`);
        });

        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            card.click();
          }
        });
      });

      // 14. CSV Exporter Trigger (INR Column Header & Plain Numeric INR)
      document.getElementById("btn-export-csv").addEventListener("click", () => {
        let csv = "Milestone ID,Client,Project,Deliverable,Value (INR),Stage,Readiness,Acceptance,Billing\n";
        MILESTONES.forEach(m => {
          csv += `"${m.id}","${m.client}","${m.project}","${m.deliverable}",${m.valueINR},${m.stage},"${m.readiness}","${m.acceptance}","${m.billing}"\n`;
        });

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "Finnova_Milestones_Ledger_INR_2026.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast("CSV Ledger exported with plain numeric INR values (10 records).");
      });

      // 15. Live Sync Trigger with Shimmer Skeleton
      document.getElementById("btn-sync-feed").addEventListener("click", () => {
        const icon = document.getElementById("sync-icon");
        icon.style.transition = "transform 0.6s ease";
        icon.style.transform = "rotate(360deg)";
        
        renderTableSkeleton();

        setTimeout(() => {
          icon.style.transform = "none";
          renderTable();
          renderKanban();
          showToast("Live telemetry feed synchronized with core treasury ledger.");
        }, 500);
      });

      // 16. Chart Node Interactive Tooltip Feedback
      const chartWrap = document.getElementById("chart-wrap");
      const chartTooltip = document.getElementById("chart-tooltip");

      document.querySelectorAll(".chart-node").forEach(node => {
        node.addEventListener("mouseenter", (e) => {
          const info = node.getAttribute("data-info");
          chartTooltip.textContent = info;
          chartTooltip.style.display = "block";
          
          const rect = chartWrap.getBoundingClientRect();
          const nodeRect = node.getBoundingClientRect();
          const leftPos = nodeRect.left - rect.left + nodeRect.width / 2;
          const topPos = nodeRect.top - rect.top;
          
          chartTooltip.style.left = `${leftPos}px`;
          chartTooltip.style.top = `${topPos}px`;
        });

        node.addEventListener("mouseleave", () => {
          chartTooltip.style.display = "none";
        });
      });

      // 17. Guidance strip chips
      document.getElementById("chip-jump-sim").addEventListener("click", () => {
        document.getElementById("liquidity-simulator-box").scrollIntoView({ behavior: "smooth" });
      });

      document.getElementById("chip-filter-ready").addEventListener("click", () => {
        activeFilter = "READY";
        document.querySelectorAll(".filter-chip-btn").forEach(c => c.classList.remove("active"));
        const chip = document.querySelector('[data-filter="READY"]');
        if (chip) chip.classList.add("active");
        renderTable();
      });

      // 18. Theme Synchronization with Shell
      window.addEventListener("message", (e) => {
        if (e.data && e.data.type === "THEME_CHANGED") {
          document.documentElement.setAttribute("data-theme", e.data.theme);
        }
      });

      const initialTheme = localStorage.getItem("finnova_theme") || "light";
      document.documentElement.setAttribute("data-theme", initialTheme);

      // Initial Render
      renderTable();
      renderKanban();
      updateSimulator(50);
    })();
