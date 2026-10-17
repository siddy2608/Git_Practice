/**
 * Finnova M-RAL - Collections Management Controller
 * Indian Enterprise INR Edition (AR Aging, Dunning Notices & MSMED Act)
 */

(function () {
  "use strict";

  // 1. Shared INR Formatting Functions
  const inrFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });

  function formatINR(val) {
    if (val === null || val === undefined || val === "") return "₹0";
    const num = Number(val);
    return isNaN(num) ? "₹0" : inrFormatter.format(num);
  }

  function formatINRCompact(val) {
    if (val === null || val === undefined || val === "") return "₹0";
    const num = Number(val);
    if (isNaN(num)) return "₹0";
    const isNegative = num < 0;
    const abs = Math.abs(num);

    if (abs >= 10000000) {
      const cr = abs / 10000000;
      return (isNegative ? "-" : "") + "₹" + (cr >= 100 ? cr.toFixed(0) : cr.toFixed(2)) + " Cr";
    } else if (abs >= 100000) {
      const lk = abs / 100000;
      return (isNegative ? "-" : "") + "₹" + (lk >= 100 ? lk.toFixed(0) : lk.toFixed(2)) + " L";
    } else if (abs >= 1000) {
      return (isNegative ? "-" : "") + "₹" + (abs / 1000).toFixed(1) + " K";
    }
    return inrFormatter.format(num);
  }

  // Toast Notification Trigger
  function triggerToast(title, message, type = "info") {
    if (window.parent && window.parent.FinnovaApp && typeof window.parent.FinnovaApp.toast === "function") {
      window.parent.FinnovaApp.toast(title, message, type);
    } else {
      console.log(`[Toast] ${type.toUpperCase()} - ${title}: ${message}`);
    }
  }

  // State
  const rawData = window.FINNOVA_COLLECTIONS_DATA || {};
  let accounts = Array.isArray(rawData.accounts) ? JSON.parse(JSON.stringify(rawData.accounts)) : [];
  let disputes = Array.isArray(rawData.disputes) ? JSON.parse(JSON.stringify(rawData.disputes)) : [];
  const dunningTemplates = rawData.dunningTemplates || {};

  let currentAgingFilter = "ALL";
  let currentDunningFilter = "ALL";
  let currentDisputeFilter = "ALL";
  let currentSearchQuery = "";
  let currentSort = "totalAR-desc";
  let selectedAccountIds = new Set();
  let activeDunningAccount = null;
  let activeDispute = null;

  // Real-time Theme Listener
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "THEME_CHANGED") {
      document.documentElement.setAttribute("data-theme", e.data.theme);
    }
  });

  // Modal Helpers
  function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.classList.remove("show");
      document.body.style.overflow = "";
    }
  }

  // ESC key listener
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop.show").forEach((el) => {
        el.classList.remove("show");
      });
      document.body.style.overflow = "";
    }
  });

  // Recalculate KPIs & Aging Spectrum
  function recalculateMetrics() {
    let totalAR = 0;
    let currentAR = 0;
    let days31to60 = 0;
    let days61to90 = 0;
    let days90plus = 0;
    let ptpTotal = 0;

    accounts.forEach((acc) => {
      totalAR += acc.totalOutstandingINR || 0;
      currentAR += (acc.aging && acc.aging.currentINR) || 0;
      days31to60 += (acc.aging && acc.aging.days31to60INR) || 0;
      days61to90 += (acc.aging && acc.aging.days61to90INR) || 0;
      days90plus += (acc.aging && acc.aging.days90plusINR) || 0;
      if (acc.ptpAmountINR && acc.totalOutstandingINR > 0) {
        ptpTotal += acc.ptpAmountINR;
      }
    });

    const setEl = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setEl("kpi-coll-total", formatINRCompact(totalAR));
    setEl("kpi-coll-current", formatINRCompact(currentAR));
    setEl("kpi-coll-31-60", formatINRCompact(days31to60));
    setEl("kpi-coll-critical", formatINRCompact(days61to90 + days90plus));
    setEl("kpi-coll-ptp", formatINRCompact(ptpTotal));

    // Update Spectrum Legend & Bars
    setEl("leg-val-current", formatINRCompact(currentAR));
    setEl("leg-val-31-60", formatINRCompact(days31to60));
    setEl("leg-val-61-90", formatINRCompact(days61to90));
    setEl("leg-val-90plus", formatINRCompact(days90plus));

    if (totalAR > 0) {
      const pctCur = ((currentAR / totalAR) * 100).toFixed(1);
      const pct30 = ((days31to60 / totalAR) * 100).toFixed(1);
      const pct60 = ((days61to90 / totalAR) * 100).toFixed(1);
      const pct90 = ((days90plus / totalAR) * 100).toFixed(1);

      const barCur = document.getElementById("spec-bar-current");
      const bar30 = document.getElementById("spec-bar-31-60");
      const bar60 = document.getElementById("spec-bar-61-90");
      const bar90 = document.getElementById("spec-bar-90plus");

      if (barCur) barCur.style.width = pctCur + "%";
      if (bar30) bar30.style.width = pct30 + "%";
      if (bar60) bar60.style.width = pct60 + "%";
      if (bar90) bar90.style.width = pct90 + "%";
    }

    // Counts for filter pills
    let countAll = accounts.length;
    let countCur = 0;
    let count31 = 0;
    let count61 = 0;
    let count90 = 0;

    accounts.forEach((acc) => {
      if (acc.agingBucket === "CURRENT") countCur++;
      if (acc.agingBucket === "31-60") count31++;
      if (acc.agingBucket === "61-90") count61++;
      if (acc.agingBucket === "90+") count90++;
    });

    setEl("coll-count-all", countAll);
    setEl("coll-count-current", countCur);
    setEl("coll-count-31-60", count31);
    setEl("coll-count-61-90", count61);
    setEl("coll-count-90plus", count90);
  }

  // Filter & Sort Accounts
  function getFilteredAccounts() {
    return accounts.filter((acc) => {
      // Aging filter
      if (currentAgingFilter === "CURRENT" && acc.agingBucket !== "CURRENT") return false;
      if (currentAgingFilter === "31-60" && acc.agingBucket !== "31-60") return false;
      if (currentAgingFilter === "61-90" && acc.agingBucket !== "61-90") return false;
      if (currentAgingFilter === "90+" && acc.agingBucket !== "90+") return false;
      if (currentAgingFilter === "61+" && acc.agingBucket !== "61-90" && acc.agingBucket !== "90+") return false;

      // Dunning filter
      if (currentDunningFilter !== "ALL" && acc.dunningLevel !== currentDunningFilter) return false;

      // Dispute filter
      if (currentDisputeFilter === "HAS_DISPUTE" && !acc.hasDispute) return false;
      if (currentDisputeFilter === "NO_DISPUTE" && acc.hasDispute) return false;

      // Search query
      if (currentSearchQuery) {
        const q = currentSearchQuery.toLowerCase();
        const match =
          (acc.client && acc.client.toLowerCase().includes(q)) ||
          (acc.clientGstin && acc.clientGstin.toLowerCase().includes(q)) ||
          (acc.contactPerson && acc.contactPerson.toLowerCase().includes(q)) ||
          (acc.collectorOwner && acc.collectorOwner.toLowerCase().includes(q)) ||
          (acc.oldestInvoiceId && acc.oldestInvoiceId.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => {
      if (currentSort === "totalAR-desc") {
        return (b.totalOutstandingINR || 0) - (a.totalOutstandingINR || 0);
      } else if (currentSort === "overdueDays-desc") {
        return (b.overdueDays || 0) - (a.overdueDays || 0);
      } else if (currentSort === "riskScore-desc") {
        return (b.riskScore || 0) - (a.riskScore || 0);
      } else if (currentSort === "ptpDate-asc") {
        return new Date(a.ptpDate || "2099-12-31") - new Date(b.ptpDate || "2099-12-31");
      }
      return 0;
    });
  }

  // Dunning Badge Helper
  function getDunningBadgeHtml(level) {
    const map = {
      None: { cls: "none", label: "None (Current)" },
      "Level 1": { cls: "level-1", label: "Level 1 Courtesy" },
      "Level 2": { cls: "level-2", label: "Level 2 Demand" },
      "Level 3": { cls: "level-3", label: "Level 3 CFO Notice" },
      "Level 4": { cls: "level-4", label: "Level 4 Legal MSMED" }
    };
    const b = map[level] || { cls: "none", label: level };
    return `<span class="dunning-badge ${b.cls}"><span class="badge-dot" style="width:6px;height:6px;border-radius:50%;display:inline-block;background:currentColor;"></span> ${b.label}</span>`;
  }

  // Risk Rating Pill Helper
  function getRiskPillHtml(risk) {
    const cls = risk ? risk.toLowerCase() : "low";
    return `<span class="risk-pill ${cls}">${risk || "Low"}</span>`;
  }

  // Render Table
  function renderTable() {
    const list = getFilteredAccounts();
    const tbody = document.getElementById("collections-tbody");
    const countEl = document.getElementById("showing-coll-count");
    if (countEl) countEl.textContent = list.length;

    let totalAR = 0;
    let overdueAR = 0;
    let criticalAR = 0;

    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.75rem; opacity: 0.6;">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div style="font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">No Accounts Found</div>
            <div style="font-size: 0.8125rem;">Try adjusting aging filters or search parameters.</div>
          </td>
        </tr>
      `;
    } else {
      let rowsHtml = "";
      list.forEach((acc) => {
        totalAR += acc.totalOutstandingINR || 0;
        if (acc.agingBucket !== "CURRENT") {
          overdueAR += acc.totalOutstandingINR || 0;
        }
        if (acc.agingBucket === "61-90" || acc.agingBucket === "90+") {
          criticalAR += acc.totalOutstandingINR || 0;
        }

        const isChecked = selectedAccountIds.has(acc.id);
        const ag = acc.aging || {};
        const curPct = acc.totalOutstandingINR > 0 ? ((ag.currentINR || 0) / acc.totalOutstandingINR) * 100 : 0;
        const p30Pct = acc.totalOutstandingINR > 0 ? ((ag.days31to60INR || 0) / acc.totalOutstandingINR) * 100 : 0;
        const p60Pct = acc.totalOutstandingINR > 0 ? ((ag.days61to90INR || 0) / acc.totalOutstandingINR) * 100 : 0;
        const p90Pct = acc.totalOutstandingINR > 0 ? ((ag.days90plusINR || 0) / acc.totalOutstandingINR) * 100 : 0;

        rowsHtml += `
          <tr data-id="${acc.id}">
            <td style="text-align: center;">
              <input type="checkbox" class="form-check-input coll-row-check" data-id="${acc.id}" ${isChecked ? "checked" : ""}>
            </td>
            <td>
              <div class="client-name-bold">${acc.client}</div>
              <div class="collector-subtext">Owner: ${acc.collectorOwner} | ${acc.clientGstin}</div>
            </td>
            <td class="table-col-numeric">
              <div style="font-weight: 700; font-size: 0.9375rem; color: ${acc.totalOutstandingINR > 0 ? 'var(--text-primary)' : 'var(--color-success)'};">
                ${formatINR(acc.totalOutstandingINR)}
              </div>
              <div class="row-mini-aging" title="Current: ${curPct.toFixed(0)}%, 31-60d: ${p30Pct.toFixed(0)}%, 61-90d: ${p60Pct.toFixed(0)}%, 90+d: ${p90Pct.toFixed(0)}%">
                <div class="row-aging-seg" style="width: ${curPct}%; background: var(--color-success);"></div>
                <div class="row-aging-seg" style="width: ${p30Pct}%; background: var(--color-info);"></div>
                <div class="row-aging-seg" style="width: ${p60Pct}%; background: var(--color-warning);"></div>
                <div class="row-aging-seg" style="width: ${p90Pct}%; background: var(--color-danger);"></div>
              </div>
            </td>
            <td>
              <span class="badge" style="background: var(--bg-surface-subtle); color: var(--text-secondary); font-size: 0.6875rem;">
                ${acc.agingBucket === "CURRENT" ? "0-30d Current" : acc.agingBucket + " Days"}
              </span>
            </td>
            <td style="white-space: nowrap;">
              <div>${acc.oldestDueDate || "—"}</div>
              <div style="font-size: 0.6875rem; color: var(--text-muted); font-family: var(--font-family-mono);">${acc.oldestInvoiceId || ""}</div>
            </td>
            <td class="table-col-numeric">
              <span style="font-weight: 700; ${acc.overdueDays > 30 ? 'color: var(--color-danger);' : (acc.overdueDays > 0 ? 'color: var(--color-warning);' : 'color: var(--color-success);')}">
                ${acc.overdueDays > 0 ? acc.overdueDays + " d" : "Current"}
              </span>
            </td>
            <td>${getDunningBadgeHtml(acc.dunningLevel)}</td>
            <td>
              ${acc.hasDispute ? `<span class="dispute-tag" onclick="window.CollectionsApp.openDisputeModal('${acc.disputeId}')">⚡ ${acc.disputeId}</span>` : '<span style="color: var(--text-muted); font-size: 0.75rem;">None</span>'}
            </td>
            <td>
              ${acc.ptpDate ? `<div style="font-size: 0.75rem; font-weight: 600;">${acc.ptpDate}</div><div style="font-size: 0.6875rem; color: var(--color-success); font-variant-numeric: tabular-nums;">${formatINR(acc.ptpAmountINR)}</div>` : '<span style="color: var(--text-muted); font-size: 0.75rem;">No Commitment</span>'}
            </td>
            <td>${getRiskPillHtml(acc.riskRating)}</td>
            <td style="text-align: right; white-space: nowrap;">
              <div style="display: inline-flex; gap: 4px;">
                <button type="button" class="action-btn-icon" title="Record Payment Remittance" onclick="window.CollectionsApp.openRecordReceipt('${acc.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                </button>
                <button type="button" class="action-btn-icon" title="Generate Dunning Notice" onclick="window.CollectionsApp.openDunningModal('${acc.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </button>
                <button type="button" class="action-btn-icon" title="View Account History" onclick="window.CollectionsApp.openHistoryModal('${acc.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      });
      tbody.innerHTML = rowsHtml;
    }

    // Update Footer Totals
    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setEl("coll-footer-total", formatINR(totalAR));
    setEl("coll-footer-overdue", formatINR(overdueAR));
    setEl("coll-footer-critical", formatINR(criticalAR));

    updateSelectedState();
  }

  // Update Batch Selection UI
  function updateSelectedState() {
    const counterWrap = document.getElementById("coll-selected-counter");
    const counterNumber = document.getElementById("coll-selected-count-number");
    const batchBtn = document.getElementById("btn-batch-dunning-selected");
    const batchCount = document.getElementById("btn-dunning-count");
    const selectAllCheck = document.getElementById("select-all-accounts");

    const count = selectedAccountIds.size;
    if (counterWrap && counterNumber) {
      if (count > 0) {
        counterWrap.style.display = "inline";
        counterNumber.textContent = count;
      } else {
        counterWrap.style.display = "none";
      }
    }

    if (batchBtn && batchCount) {
      if (count > 0) {
        batchBtn.style.display = "inline-flex";
        batchCount.textContent = count;
      } else {
        batchBtn.style.display = "none";
      }
    }

    const visibleRows = document.querySelectorAll(".coll-row-check");
    if (selectAllCheck) {
      selectAllCheck.checked = visibleRows.length > 0 && Array.from(visibleRows).every((cb) => cb.checked);
    }
  }

  // Open Record Remittance Modal
  function openRecordReceipt(accountId) {
    const acc = accounts.find((x) => x.id === accountId) || accounts[0];
    if (!acc) return;

    document.getElementById("receipt-account-id").value = acc.id;
    document.getElementById("receipt-client-name").value = `${acc.client} (Outstanding: ${formatINR(acc.totalOutstandingINR)})`;
    document.getElementById("receipt-amount").value = acc.totalOutstandingINR || 1000000;
    document.getElementById("receipt-tds").value = Math.round((acc.totalOutstandingINR || 1000000) * 0.1);
    document.getElementById("receipt-utr").value = "HDFCR52026" + Math.floor(100000 + Math.random() * 900000);
    document.getElementById("receipt-date").value = new Date().toISOString().split("T")[0];

    openModal("modal-record-receipt");
  }

  // Open Dunning Modal
  function openDunningModal(accountId) {
    const acc = accounts.find((x) => x.id === accountId) || accounts[0];
    if (!acc) return;
    activeDunningAccount = acc;

    document.getElementById("dunning-account-id").value = acc.id;
    document.getElementById("dunning-recipient-email").value = acc.contactEmail || "finance.ap@clientcorp.com";

    // Set level based on days overdue
    let targetLevel = "LEVEL_1";
    if (acc.overdueDays > 60) targetLevel = "LEVEL_3";
    else if (acc.overdueDays > 30) targetLevel = "LEVEL_2";
    if (acc.overdueDays > 75) targetLevel = "LEVEL_4";

    const sel = document.getElementById("dunning-level-select");
    if (sel) sel.value = targetLevel;

    updateDunningPreview(targetLevel, acc);
    openModal("modal-dunning-notice");
  }

  // Update Dunning Letter Preview
  function updateDunningPreview(levelKey, acc) {
    const template = dunningTemplates[levelKey] || dunningTemplates.LEVEL_1;
    const amountStr = formatINR(acc.totalOutstandingINR || 5000000);

    const subject = template.subject.replace("[ClientName]", acc.client);
    let body = template.content
      .replace(/\[ClientName\]/g, acc.client)
      .replace(/\[OverdueAmountINR\]/g, amountStr)
      .replace(/\[OverdueDays\]/g, acc.overdueDays || 30)
      .replace(/\[ProjectName\]/g, "Enterprise IT Transformation Program");

    const subjEl = document.getElementById("dunning-preview-subject");
    const bodyEl = document.getElementById("dunning-preview-body");
    const codeEl = document.getElementById("dunning-ref-code");

    if (subjEl) subjEl.textContent = "Subject: " + subject;
    if (bodyEl) bodyEl.textContent = body;
    if (codeEl) codeEl.textContent = `DUN-2026-${acc.id.split("-")[2] || "001"}`;
  }

  // Open Dispute Modal
  function openDisputeModal(disputeId) {
    const disp = disputes.find((x) => x.id === disputeId);
    if (!disp) return;
    activeDispute = disp;

    const setEl = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setEl("disp-ref-id", disp.id);
    setEl("disp-client-name", disp.client);
    setEl("disp-inv-id", disp.invoiceId);
    setEl("disp-amount", formatINR(disp.amountINR));
    setEl("disp-summary-text", disp.summary);
    setEl("disp-status-badge", disp.status);

    openModal("modal-dispute-details");
  }

  // Open Account History Modal
  function openHistoryModal(accountId) {
    const acc = accounts.find((x) => x.id === accountId);
    if (!acc) return;

    const setEl = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setEl("hist-client-title", acc.client);
    setEl("hist-contact-meta", `Contact: ${acc.contactPerson} (${acc.contactEmail}) | Credit Limit: ${formatINR(acc.creditLimitINR)}`);

    const container = document.getElementById("hist-timeline-container");
    if (container) {
      let timelineHtml = "";
      const history = acc.history || [
        { date: "2026-03-01", type: "Ledger", desc: "Account ledger audit verified." }
      ];

      history.forEach((item) => {
        timelineHtml += `
          <div class="dispute-timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <strong>${item.type}</strong>
                <span style="font-size: 0.6875rem; color: var(--text-muted);">${item.date}</span>
              </div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">${item.desc}</div>
            </div>
          </div>
        `;
      });
      container.innerHTML = timelineHtml;
    }

    openModal("modal-account-history");
  }

  // Export AR Aging to CSV
  function exportARCSV() {
    const list = getFilteredAccounts();
    if (list.length === 0) {
      triggerToast("Export AR Ledger", "No accounts available to export.", "warning");
      return;
    }

    const headers = [
      "Account ID",
      "Client Name",
      "GSTIN",
      "Contact Person",
      "Contact Email",
      "Credit Limit (INR)",
      "Total Outstanding AR (INR)",
      "Current 0-30d (INR)",
      "31-60 Days (INR)",
      "61-90 Days (INR)",
      "90+ Days (INR)",
      "Days Overdue (DSO)",
      "Aging Bucket",
      "Dunning Level",
      "Risk Rating",
      "Has Dispute",
      "PTP Date",
      "PTP Amount (INR)",
      "Collector Owner"
    ];

    const rows = list.map((acc) => [
      `"${acc.id}"`,
      `"${acc.client}"`,
      `"${acc.clientGstin}"`,
      `"${acc.contactPerson}"`,
      `"${acc.contactEmail}"`,
      acc.creditLimitINR || 0,
      acc.totalOutstandingINR || 0,
      (acc.aging && acc.aging.currentINR) || 0,
      (acc.aging && acc.aging.days31to60INR) || 0,
      (acc.aging && acc.aging.days61to90INR) || 0,
      (acc.aging && acc.aging.days90plusINR) || 0,
      acc.overdueDays || 0,
      `"${acc.agingBucket}"`,
      `"${acc.dunningLevel}"`,
      `"${acc.riskRating}"`,
      acc.hasDispute ? "YES" : "NO",
      `"${acc.ptpDate || ''}"`,
      acc.ptpAmountINR || 0,
      `"${acc.collectorOwner}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Finnova_AR_Aging_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast("AR Report Exported", `Downloaded AR Aging ledger with ${list.length} accounts.`, "success");
  }

  // Event Listeners
  function initEvents() {
    // Search
    const searchInput = document.getElementById("coll-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        currentSearchQuery = e.target.value.trim();
        renderTable();
      });
    }

    // Aging filter pills
    document.querySelectorAll(".aging-pill-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".aging-pill-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentAgingFilter = btn.dataset.bucket;
        renderTable();
      });
    });

    // KPI Cards interactive click
    document.querySelectorAll(".kpi-card-coll").forEach((card) => {
      card.addEventListener("click", () => {
        const filter = card.dataset.filter;
        if (!filter) return;
        currentAgingFilter = filter;

        document.querySelectorAll(".aging-pill-btn").forEach((b) => {
          if (b.dataset.bucket === filter) {
            b.classList.add("active");
          } else {
            b.classList.remove("active");
          }
        });
        renderTable();
      });
    });

    // Spectrum Progress Bar segment clicks
    const segMap = [
      { id: "spec-bar-current", filter: "CURRENT" },
      { id: "spec-bar-31-60", filter: "31-60" },
      { id: "spec-bar-61-90", filter: "61-90" },
      { id: "spec-bar-90plus", filter: "90+" }
    ];
    segMap.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) {
        el.addEventListener("click", () => {
          currentAgingFilter = item.filter;
          document.querySelectorAll(".aging-pill-btn").forEach((b) => {
            if (b.dataset.bucket === item.filter) b.classList.add("active");
            else b.classList.remove("active");
          });
          renderTable();
        });
      }
    });

    // Spectrum Legend Clicks
    document.querySelectorAll(".legend-item").forEach((item) => {
      item.addEventListener("click", () => {
        const filter = item.dataset.filter;
        if (!filter) return;
        currentAgingFilter = filter;
        document.querySelectorAll(".aging-pill-btn").forEach((b) => {
          if (b.dataset.bucket === filter) b.classList.add("active");
          else b.classList.remove("active");
        });
        renderTable();
      });
    });

    // Dunning Select Filter
    const dunningSel = document.getElementById("filter-dunning");
    if (dunningSel) {
      dunningSel.addEventListener("change", (e) => {
        currentDunningFilter = e.target.value;
        renderTable();
      });
    }

    // Dispute Filter
    const dispSel = document.getElementById("filter-disputes");
    if (dispSel) {
      dispSel.addEventListener("change", (e) => {
        currentDisputeFilter = e.target.value;
        renderTable();
      });
    }

    // Sort Filter
    const sortSel = document.getElementById("filter-sort-coll");
    if (sortSel) {
      sortSel.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderTable();
      });
    }

    // Master Checkbox Select All
    const selectAllCheck = document.getElementById("select-all-accounts");
    if (selectAllCheck) {
      selectAllCheck.addEventListener("change", (e) => {
        const checked = e.target.checked;
        const visible = getFilteredAccounts();
        if (checked) {
          visible.forEach((x) => selectedAccountIds.add(x.id));
        } else {
          selectedAccountIds.clear();
        }
        renderTable();
      });
    }

    // Row Checkbox Delegate
    const tableBody = document.getElementById("collections-tbody");
    if (tableBody) {
      tableBody.addEventListener("change", (e) => {
        if (e.target && e.target.classList.contains("coll-row-check")) {
          const accId = e.target.dataset.id;
          if (e.target.checked) {
            selectedAccountIds.add(accId);
          } else {
            selectedAccountIds.delete(accId);
          }
          updateSelectedState();
        }
      });
    }

    // Header Actions
    const btnSync = document.getElementById("btn-sync-collections");
    if (btnSync) {
      btnSync.addEventListener("click", () => {
        triggerToast("Syncing Receivables", "Fetching latest UTR credits and clearing entries from RBI clearing switch...", "info");
        setTimeout(() => {
          recalculateMetrics();
          renderTable();
          triggerToast("Collections Synchronized", "AR ledger reconciled against HDFC & ICICI bank feeds.", "success");
        }, 600);
      });
    }

    const btnExport = document.getElementById("btn-export-ar-csv");
    if (btnExport) btnExport.addEventListener("click", exportARCSV);

    // Open Payment Modal from Header button
    const btnOpenPay = document.getElementById("btn-open-payment-modal");
    if (btnOpenPay) {
      btnOpenPay.addEventListener("click", () => {
        openRecordReceipt(accounts[0].id);
      });
    }

    // Batch Dunning Trigger
    const triggerBatchDunning = () => {
      const targetIds = selectedAccountIds.size > 0 ? Array.from(selectedAccountIds) : accounts.filter((x) => x.overdueDays > 0).map((x) => x.id);
      if (targetIds.length === 0) {
        triggerToast("Batch Dunning", "No overdue accounts selected for reminder dispatch.", "warning");
        return;
      }

      let count = 0;
      accounts.forEach((acc) => {
        if (targetIds.includes(acc.id) && acc.totalOutstandingINR > 0) {
          if (acc.dunningLevel === "None") acc.dunningLevel = "Level 1";
          else if (acc.dunningLevel === "Level 1") acc.dunningLevel = "Level 2";
          else if (acc.dunningLevel === "Level 2") acc.dunningLevel = "Level 3";
          acc.lastActivity = "Automated dunning notice dispatched to finance desk.";
          count++;
        }
      });

      selectedAccountIds.clear();
      recalculateMetrics();
      renderTable();

      triggerToast("Dunning Dispatched", `Sent structured dunning demand notices to ${count} accounts with statement attachments.`, "success");
    };

    const btnBatchTrigger = document.getElementById("btn-dunning-batch-trigger");
    if (btnBatchTrigger) btnBatchTrigger.addEventListener("click", triggerBatchDunning);

    const btnBatchSelected = document.getElementById("btn-batch-dunning-selected");
    if (btnBatchSelected) btnBatchSelected.addEventListener("click", triggerBatchDunning);

    // Dunning Level Select in Modal
    const dunningLevelSel = document.getElementById("dunning-level-select");
    if (dunningLevelSel) {
      dunningLevelSel.addEventListener("change", (e) => {
        if (activeDunningAccount) {
          updateDunningPreview(e.target.value, activeDunningAccount);
        }
      });
    }

    // Copy Dunning Text
    const btnCopy = document.getElementById("btn-copy-dunning");
    if (btnCopy) {
      btnCopy.addEventListener("click", () => {
        const bodyText = document.getElementById("dunning-preview-body").textContent;
        navigator.clipboard.writeText(bodyText).then(() => {
          triggerToast("Text Copied", "Dunning notice copied to clipboard.", "success");
        });
      });
    }

    // Dispatch Single Dunning Notice
    const btnDispatchDunning = document.getElementById("btn-dispatch-dunning");
    if (btnDispatchDunning) {
      btnDispatchDunning.addEventListener("click", () => {
        if (!activeDunningAccount) return;
        const levelKey = document.getElementById("dunning-level-select").value;
        const levelNames = {
          LEVEL_1: "Level 1",
          LEVEL_2: "Level 2",
          LEVEL_3: "Level 3",
          LEVEL_4: "Level 4"
        };
        activeDunningAccount.dunningLevel = levelNames[levelKey] || "Level 1";
        activeDunningAccount.lastActivity = `${activeDunningAccount.dunningLevel} notice sent on ${new Date().toLocaleDateString("en-IN")}`;

        recalculateMetrics();
        renderTable();
        closeModal("modal-dunning-notice");

        triggerToast(
          "Dunning Notice Dispatched",
          `Dispatched ${activeDunningAccount.dunningLevel} notice to ${activeDunningAccount.client} (${activeDunningAccount.contactEmail}).`,
          "success"
        );
      });
    }

    // Submit Payment Remittance
    const btnSubmitReceipt = document.getElementById("btn-submit-receipt");
    if (btnSubmitReceipt) {
      btnSubmitReceipt.addEventListener("click", () => {
        const accId = document.getElementById("receipt-account-id").value;
        const amount = Number(document.getElementById("receipt-amount").value) || 0;
        const tds = Number(document.getElementById("receipt-tds").value) || 0;
        const utr = document.getElementById("receipt-utr").value.trim() || "UTR" + Date.now();
        const mode = document.getElementById("receipt-mode").value;
        const date = document.getElementById("receipt-date").value || new Date().toISOString().split("T")[0];

        const acc = accounts.find((x) => x.id === accId);
        if (!acc || amount <= 0) {
          triggerToast("Payment Record", "Please specify a valid payment amount.", "warning");
          return;
        }

        const totalCredit = amount + tds;
        acc.totalOutstandingINR = Math.max(0, (acc.totalOutstandingINR || 0) - totalCredit);

        if (acc.totalOutstandingINR === 0) {
          acc.agingBucket = "CURRENT";
          acc.overdueDays = 0;
          acc.dunningLevel = "None";
          acc.riskRating = "Low";
          acc.aging = { currentINR: 0, days31to60INR: 0, days61to90INR: 0, days90plusINR: 0 };
        } else {
          // Proportionately reduce buckets
          if (acc.aging) {
            acc.aging.days90plusINR = Math.max(0, (acc.aging.days90plusINR || 0) - totalCredit);
            acc.aging.days61to90INR = Math.max(0, (acc.aging.days61to90INR || 0) - Math.max(0, totalCredit - acc.aging.days90plusINR));
          }
        }

        acc.history = acc.history || [];
        acc.history.unshift({
          date: date,
          type: "Payment",
          desc: `Received ${formatINR(amount)} via ${mode} (UTR #${utr}). TDS acknowledged: ${formatINR(tds)}.`
        });

        recalculateMetrics();
        renderTable();
        closeModal("modal-record-receipt");

        triggerToast(
          "Remittance Posted",
          `Posted ${formatINR(amount)} against ${acc.client}. Remaining balance: ${formatINR(acc.totalOutstandingINR)}.`,
          "success"
        );
      });
    }

    // Resolve Dispute
    const btnResolveDispute = document.getElementById("btn-resolve-dispute");
    if (btnResolveDispute) {
      btnResolveDispute.addEventListener("click", () => {
        if (!activeDispute) return;

        const action = document.getElementById("disp-resolution-action").value;
        const notes = document.getElementById("disp-notes").value.trim();

        activeDispute.status = "Resolved";
        const acc = accounts.find((x) => x.id === activeDispute.accountId);
        if (acc) {
          acc.hasDispute = false;
          acc.lastActivity = `Dispute ${activeDispute.id} resolved (${action}). ${notes}`;
          acc.history = acc.history || [];
          acc.history.unshift({
            date: new Date().toISOString().split("T")[0],
            type: "Dispute Resolved",
            desc: `Resolved dispute ${activeDispute.id}: ${action}. ${notes}`
          });
        }

        renderTable();
        closeModal("modal-dispute-details");

        triggerToast(
          "Dispute Resolved",
          `Dispute ${activeDispute.id} closed successfully with commercial agreement.`,
          "success"
        );
      });
    }
  }

  // Initialization
  function init() {
    initEvents();
    recalculateMetrics();
    renderTable();
  }

  // Window API
  window.CollectionsApp = {
    init,
    openModal,
    closeModal,
    openRecordReceipt,
    openDunningModal,
    openDisputeModal,
    openHistoryModal,
    exportARCSV
  };

  document.addEventListener("DOMContentLoaded", init);
})();
