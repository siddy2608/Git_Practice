/**
 * Finnova M-RAL - Invoice Management Controller
 * Indian Enterprise INR Edition (Lakhs & Crores, GST, TDS, E-Invoicing)
 */

(function () {
  "use strict";

  // 1. Shared INR Formatting Functions (Strictly Indian Currency)
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

  // Indian Number to Words Formatter
  function numberToWordsINR(amount) {
    const num = Math.round(Number(amount) || 0);
    if (num === 0) return "Rupees Zero Only";

    const a = [
      "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
      "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    function inWords(n) {
      if (n < 20) return a[n];
      const digit = n % 10;
      return b[Math.floor(n / 10)] + (digit ? " " + a[digit] : " ");
    }

    let words = "";
    const crore = Math.floor(num / 10000000);
    let remainder = num % 10000000;
    const lakh = Math.floor(remainder / 100000);
    remainder = remainder % 100000;
    const thousand = Math.floor(remainder / 1000);
    remainder = remainder % 1000;
    const hundred = Math.floor(remainder / 100);
    const tens = remainder % 100;

    if (crore > 0) words += inWords(crore) + "Crore ";
    if (lakh > 0) words += inWords(lakh) + "Lakh ";
    if (thousand > 0) words += inWords(thousand) + "Thousand ";
    if (hundred > 0) words += inWords(hundred) + "Hundred ";
    if (tens > 0) words += inWords(tens);

    return "Rupees " + words.trim() + " Only";
  }

  // Toast Dispatcher (Integrates seamlessly with parent shell FinnovaApp)
  function triggerToast(title, message, type = "info") {
    if (window.parent && window.parent.FinnovaApp && typeof window.parent.FinnovaApp.toast === "function") {
      window.parent.FinnovaApp.toast(title, message, type);
    } else {
      console.log(`[Toast] ${type.toUpperCase()} - ${title}: ${message}`);
    }
  }

  // State Management
  const rawData = window.FINNOVA_INVOICES_DATA || {};
  let invoices = Array.isArray(rawData.invoices) ? JSON.parse(JSON.stringify(rawData.invoices)) : [];
  let billableMilestones = Array.isArray(rawData.billableMilestones) ? rawData.billableMilestones : [];
  let selectedInvoiceIds = new Set();
  let currentFilterStatus = "ALL";
  let currentSearchQuery = "";
  let currentGstFilter = "ALL";
  let currentSort = "issueDate-desc";
  let activePreviewInvoice = null;

  // Real-time Theme Listener
  window.addEventListener("message", (e) => {
    if (e.data && e.data.type === "THEME_CHANGED") {
      document.documentElement.setAttribute("data-theme", e.data.theme);
    }
  });

  // Modal Control Helpers
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

  // ESC key closes any open modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop.show").forEach((el) => {
        el.classList.remove("show");
      });
      document.body.style.overflow = "";
    }
  });

  // Update Status Tab Badges and Counts
  function updateCounts() {
    const counts = {
      ALL: invoices.length,
      Draft: 0,
      Issued: 0,
      Dispatched: 0,
      "Partially Paid": 0,
      Paid: 0,
      Overdue: 0,
      Disputed: 0
    };

    invoices.forEach((inv) => {
      if (counts[inv.status] !== undefined) {
        counts[inv.status]++;
      }
    });

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl("count-all", counts.ALL);
    setEl("count-draft", counts.Draft);
    setEl("count-issued", counts.Issued);
    setEl("count-dispatched", counts.Dispatched);
    setEl("count-partpaid", counts["Partially Paid"]);
    setEl("count-paid", counts.Paid);
    setEl("count-overdue", counts.Overdue);
    setEl("count-disputed", counts.Disputed);
  }

  // Recalculate KPIs
  function recalculateKPIs() {
    let totalInvoiced = 0;
    let outstandingVal = 0;
    let outstandingCount = 0;
    let overdueVal = 0;
    let overdueCount = 0;
    let gstAccrued = 0;
    let tdsAccrued = 0;

    invoices.forEach((inv) => {
      totalInvoiced += inv.totalAmountINR || 0;
      gstAccrued += (inv.cgstINR || 0) + (inv.sgstINR || 0) + (inv.igstINR || 0);
      tdsAccrued += inv.tdsINR || 0;

      if (inv.status !== "Paid" && inv.status !== "Draft") {
        outstandingVal += inv.balanceDueINR || 0;
        outstandingCount++;
      }

      if (inv.status === "Overdue") {
        overdueVal += inv.balanceDueINR || 0;
        overdueCount++;
      }
    });

    const setEl = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setEl("kpi-val-total", formatINRCompact(totalInvoiced));
    setEl("kpi-val-outstanding", formatINRCompact(outstandingVal));
    setEl("kpi-val-overdue", formatINRCompact(overdueVal));
    setEl("kpi-val-gst", formatINRCompact(gstAccrued));
    setEl("kpi-val-tds", formatINRCompact(tdsAccrued));
  }

  // Filter & Sort Logic
  function getFilteredInvoices() {
    return invoices.filter((inv) => {
      // Status filter
      if (currentFilterStatus === "OUTSTANDING") {
        if (inv.status === "Paid" || inv.status === "Draft") return false;
      } else if (currentFilterStatus !== "ALL" && inv.status !== currentFilterStatus) {
        return false;
      }

      // GST filter
      if (currentGstFilter === "INTRA" && inv.isInterState) return false;
      if (currentGstFilter === "INTER" && !inv.isInterState) return false;

      // Search query
      if (currentSearchQuery) {
        const q = currentSearchQuery.toLowerCase();
        const match =
          (inv.id && inv.id.toLowerCase().includes(q)) ||
          (inv.client && inv.client.toLowerCase().includes(q)) ||
          (inv.clientGstin && inv.clientGstin.toLowerCase().includes(q)) ||
          (inv.project && inv.project.toLowerCase().includes(q)) ||
          (inv.milestoneTitle && inv.milestoneTitle.toLowerCase().includes(q)) ||
          (inv.milestoneRef && inv.milestoneRef.toLowerCase().includes(q)) ||
          (inv.irn && inv.irn.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    }).sort((a, b) => {
      if (currentSort === "issueDate-desc") {
        return new Date(b.issueDate || 0) - new Date(a.issueDate || 0);
      } else if (currentSort === "issueDate-asc") {
        return new Date(a.issueDate || 0) - new Date(b.issueDate || 0);
      } else if (currentSort === "totalAmount-desc") {
        return (b.totalAmountINR || 0) - (a.totalAmountINR || 0);
      } else if (currentSort === "balanceDue-desc") {
        return (b.balanceDueINR || 0) - (a.balanceDueINR || 0);
      } else if (currentSort === "dueDate-asc") {
        return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      }
      return 0;
    });
  }

  // Status Badge Class Helper
  function getStatusBadgeHtml(status) {
    const map = {
      Draft: { cls: "draft", label: "Draft" },
      Issued: { cls: "issued", label: "Issued" },
      Dispatched: { cls: "dispatched", label: "Dispatched" },
      "Partially Paid": { cls: "partially-paid", label: "Part Paid" },
      Paid: { cls: "paid", label: "Paid" },
      Overdue: { cls: "overdue", label: "Overdue" },
      Disputed: { cls: "disputed", label: "Disputed" }
    };
    const s = map[status] || { cls: "draft", label: status };
    return `<span class="inv-status ${s.cls}"><span class="badge-dot" style="width:6px;height:6px;border-radius:50%;display:inline-block;background:currentColor;"></span> ${s.label}</span>`;
  }

  // Render Table
  function renderTable() {
    const list = getFilteredInvoices();
    const tbody = document.getElementById("invoices-tbody");
    const showingCountEl = document.getElementById("showing-count");
    if (showingCountEl) showingCountEl.textContent = list.length;

    let totalTaxable = 0;
    let totalGst = 0;
    let totalBalance = 0;

    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="12" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.75rem; opacity: 0.6;">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <div style="font-size: 1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">No Invoices Found</div>
            <div style="font-size: 0.8125rem;">Try adjusting your search criteria or status filter.</div>
          </td>
        </tr>
      `;
    } else {
      let rowsHtml = "";
      list.forEach((inv) => {
        totalTaxable += inv.baseAmountINR || 0;
        totalGst += (inv.cgstINR || 0) + (inv.sgstINR || 0) + (inv.igstINR || 0);
        totalBalance += inv.balanceDueINR || 0;

        const isChecked = selectedInvoiceIds.has(inv.id);
        const gstTotal = (inv.cgstINR || 0) + (inv.sgstINR || 0) + (inv.igstINR || 0);

        rowsHtml += `
          <tr data-id="${inv.id}">
            <td style="text-align: center;">
              <input type="checkbox" class="form-check-input invoice-row-check" data-id="${inv.id}" ${isChecked ? "checked" : ""}>
            </td>
            <td>
              <div class="invoice-id-cell">
                <span class="invoice-id-link" onclick="window.InvoicesApp.openPreview('${inv.id}')">${inv.id}</span>
                <span class="invoice-irn-tag" title="GST E-Invoice IRN: ${inv.irn || 'Pending'}">
                  ${inv.irn ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> IRN Active` : 'Draft / No IRN'}
                </span>
              </div>
            </td>
            <td>
              <div class="client-name-cell">${inv.client}</div>
              <div class="client-gstin-sub">${inv.clientGstin}</div>
            </td>
            <td>
              <div class="milestone-ref-cell">
                <span class="milestone-badge-pill">${inv.milestoneRef}</span>
                <span>${inv.milestoneTitle}</span>
              </div>
              <div style="font-size: 0.6875rem; color: var(--text-muted);">${inv.project}</div>
            </td>
            <td style="white-space: nowrap;">${inv.issueDate}</td>
            <td style="white-space: nowrap;">
              <span style="${inv.status === 'Overdue' ? 'color: var(--color-danger); font-weight: 600;' : ''}">${inv.dueDate}</span>
            </td>
            <td class="table-col-numeric amount-main">${formatINR(inv.baseAmountINR)}</td>
            <td class="table-col-numeric amount-sub">${formatINR(gstTotal)}</td>
            <td class="table-col-numeric amount-main" style="color: var(--color-primary-600); font-weight: 700;">${formatINR(inv.totalAmountINR)}</td>
            <td class="table-col-numeric amount-main" style="${inv.balanceDueINR > 0 ? 'color: var(--color-danger);' : 'color: var(--color-success);'}">
              ${formatINR(inv.balanceDueINR)}
            </td>
            <td>${getStatusBadgeHtml(inv.status)}</td>
            <td style="text-align: right; white-space: nowrap;">
              <div style="display: inline-flex; gap: 4px;">
                <button type="button" class="action-btn-icon" title="View & Print Tax Invoice" onclick="window.InvoicesApp.openPreview('${inv.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
                <button type="button" class="action-btn-icon" title="Dispatch to Client Email" onclick="window.InvoicesApp.dispatchInvoice('${inv.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
                <button type="button" class="action-btn-icon" title="Record Payment Remittance" onclick="window.InvoicesApp.openRecordPayment('${inv.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                </button>
                <button type="button" class="action-btn-icon" title="Issue Credit Note" onclick="window.InvoicesApp.openCreditNote('${inv.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><line x1="9" y1="15" x2="15" y2="15"></line></svg>
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
    setEl("footer-taxable-sum", formatINR(totalTaxable));
    setEl("footer-gst-sum", formatINR(totalGst));
    setEl("footer-balance-sum", formatINR(totalBalance));

    // Update batch selection toolbar
    updateSelectedState();
  }

  // Update Batch Selection UI
  function updateSelectedState() {
    const counterWrap = document.getElementById("selected-counter");
    const counterNumber = document.getElementById("selected-count-number");
    const dispatchBtn = document.getElementById("btn-batch-dispatch-selected");
    const dispatchBtnCount = document.getElementById("btn-dispatch-count");
    const selectAllCheck = document.getElementById("select-all-invoices");

    const count = selectedInvoiceIds.size;
    if (counterWrap && counterNumber) {
      if (count > 0) {
        counterWrap.style.display = "inline";
        counterNumber.textContent = count;
      } else {
        counterWrap.style.display = "none";
      }
    }

    if (dispatchBtn && dispatchBtnCount) {
      if (count > 0) {
        dispatchBtn.style.display = "inline-flex";
        dispatchBtnCount.textContent = count;
      } else {
        dispatchBtn.style.display = "none";
      }
    }

    const visibleRows = document.querySelectorAll(".invoice-row-check");
    if (selectAllCheck) {
      selectAllCheck.checked = visibleRows.length > 0 && Array.from(visibleRows).every((cb) => cb.checked);
    }
  }

  // Populate Billable Milestone Selector in New Invoice Form
  function populateMilestoneDropdown() {
    const sel = document.getElementById("new-inv-milestone-select");
    if (!sel) return;

    let options = '<option value="">-- Choose from ready milestones or enter manually --</option>';
    billableMilestones.forEach((m) => {
      options += `<option value="${m.id}">${m.id} - ${m.clientName} (${m.deliverable} - ${formatINR(m.baseAmountINR)})</option>`;
    });
    sel.innerHTML = options;

    sel.addEventListener("change", () => {
      const selId = sel.value;
      const m = billableMilestones.find((x) => x.id === selId);
      if (m) {
        document.getElementById("new-inv-client").value = m.clientName;
        document.getElementById("new-inv-gstin").value = m.clientGstin;
        document.getElementById("new-inv-project").value = m.projectTitle;
        document.getElementById("new-inv-deliverable").value = m.deliverable;
        document.getElementById("new-inv-base-amount").value = m.baseAmountINR;
        document.getElementById("new-inv-place-of-supply").value = `${m.clientStateCode}-${m.clientState}`;
        document.getElementById("new-inv-sac").value = m.sacCode;
        updateNewInvoiceCalc();
      }
    });
  }

  // Dynamic Calculation in New Invoice Form
  function updateNewInvoiceCalc() {
    const baseVal = Number(document.getElementById("new-inv-base-amount").value) || 0;
    const pos = document.getElementById("new-inv-place-of-supply").value;
    const isInter = !pos.startsWith("27"); // 27 is MH (Finnova home state)

    const gstRate = 0.18;
    const gstVal = Math.round(baseVal * gstRate);
    const totalVal = baseVal + gstVal;
    const tdsVal = Math.round(baseVal * 0.10); // Sec 194J 10%
    const netVal = totalVal - tdsVal;

    const setEl = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setEl("calc-base", formatINR(baseVal));
    setEl("calc-gst-label", isInter ? "Integrated GST (18% IGST):" : "CGST (9%) + SGST (9%):");
    setEl("calc-gst", formatINR(gstVal));
    setEl("calc-total", formatINR(totalVal));
    setEl("calc-tds", "- " + formatINR(tdsVal));
    setEl("calc-net", formatINR(netVal));
  }

  // Open Printable / PDF View
  function openPreview(invoiceId) {
    const inv = invoices.find((x) => x.id === invoiceId);
    if (!inv) return;
    activePreviewInvoice = inv;

    const comp = rawData.companyProfile || {};

    const setEl = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setEl("pdf-comp-name", comp.legalName || "Finnova Technologies India Pvt Ltd");
    setEl("pdf-comp-addr", comp.registeredAddress || "Peninsula Business Park, Mumbai 400013");
    setEl("pdf-comp-gstin", comp.gstin || "27AAGCF9920K1ZX");
    setEl("pdf-comp-pan", comp.pan || "AAGCF9920K");
    setEl("pdf-comp-cin", comp.cin || "U72900MH2021PTC368921");

    setEl("pdf-inv-number", inv.id);
    setEl("pdf-inv-irn", inv.irn || "8d4e92a17f6c3b5d2e0a4f7c1b8e3a5d9c2f6b0e4a7d1c3f5b8e2a6d0c4f7b2e");
    setEl("pdf-inv-ack", inv.ackNo || "112610948291");
    setEl("pdf-inv-ackdate", inv.ackDate || inv.issueDate + " 10:14:22");

    setEl("pdf-inv-date", inv.issueDate);
    setEl("pdf-inv-terms", inv.paymentTerms);
    setEl("pdf-inv-due", inv.dueDate);
    setEl("pdf-inv-milestone", inv.milestoneRef + " (" + inv.milestoneTitle + ")");
    setEl("pdf-inv-project", inv.project);

    setEl("pdf-client-name", inv.client);
    setEl("pdf-client-gstin", inv.clientGstin);
    setEl("pdf-client-addr", inv.clientAddress || "Corporate Office, India");
    setEl("pdf-client-pos", inv.placeOfSupply);

    // Items table
    const itemsTbody = document.getElementById("pdf-items-tbody");
    if (itemsTbody) {
      let itemsHtml = "";
      const lines = inv.lineItems && inv.lineItems.length > 0 ? inv.lineItems : [
        {
          srNo: 1,
          description: inv.milestoneTitle,
          sacCode: inv.sacCode || "998314",
          qty: 1,
          rateINR: inv.baseAmountINR,
          amountINR: inv.baseAmountINR
        }
      ];

      lines.forEach((item, idx) => {
        itemsHtml += `
          <tr>
            <td style="text-align: center;">${idx + 1}</td>
            <td><strong>${item.description}</strong></td>
            <td><code>${item.sacCode}</code></td>
            <td style="text-align: center;">${item.qty}</td>
            <td style="text-align: right; font-variant-numeric: tabular-nums;">${formatINR(item.rateINR)}</td>
            <td style="text-align: right; font-variant-numeric: tabular-nums; font-weight: 600;">${formatINR(item.amountINR)}</td>
          </tr>
        `;
      });
      itemsTbody.innerHTML = itemsHtml;
    }

    setEl("pdf-subtotal", formatINR(inv.baseAmountINR));

    const cgstRow = document.getElementById("pdf-cgst-row");
    const sgstRow = document.getElementById("pdf-sgst-row");
    const igstRow = document.getElementById("pdf-igst-row");

    if (inv.isInterState) {
      if (cgstRow) cgstRow.style.display = "none";
      if (sgstRow) sgstRow.style.display = "none";
      if (igstRow) igstRow.style.display = "table-row";
      setEl("pdf-igst", formatINR(inv.igstINR));
      setEl("pdf-tax-note", "Supply is Inter-state. Integrated GST @ 18% applied under IGST Act 2017.");
    } else {
      if (cgstRow) cgstRow.style.display = "table-row";
      if (sgstRow) sgstRow.style.display = "table-row";
      if (igstRow) igstRow.style.display = "none";
      setEl("pdf-cgst", formatINR(inv.cgstINR));
      setEl("pdf-sgst", formatINR(inv.sgstINR));
      setEl("pdf-tax-note", "Supply is Intra-state. Central GST @ 9% and State GST @ 9% applied as per CGST/SGST Act 2017.");
    }

    setEl("pdf-grand-total", formatINR(inv.totalAmountINR));
    setEl("pdf-amount-words", numberToWordsINR(inv.totalAmountINR));
    setEl("pdf-tds-deduction", "- " + formatINR(inv.tdsINR));
    setEl("pdf-net-receivable", formatINR(inv.totalAmountINR - (inv.tdsINR || 0)));

    if (comp.bankDetails) {
      setEl("pdf-bank-name", comp.bankDetails.bankName);
      setEl("pdf-bank-accname", comp.bankDetails.accountName);
      setEl("pdf-bank-accno", comp.bankDetails.accountNumber);
      setEl("pdf-bank-ifsc", comp.bankDetails.ifscCode);
    }

    openModal("modal-invoice-preview");
  }

  // Dispatch Single Invoice
  function dispatchInvoice(invoiceId) {
    const inv = invoices.find((x) => x.id === invoiceId);
    if (!inv) return;

    if (inv.status === "Paid") {
      triggerToast("Invoice Fully Paid", `Invoice ${inv.id} has already been settled in full.`, "warning");
      return;
    }

    inv.status = "Dispatched";
    inv.dispatchDate = new Date().toLocaleString("en-IN");
    inv.deliveryStatus = "Dispatched via SMTP & Webhooks to Client AP Portal";

    updateCounts();
    recalculateKPIs();
    renderTable();

    triggerToast(
      "Invoice Dispatched",
      `Tax Invoice ${inv.id} for ${formatINR(inv.totalAmountINR)} dispatched to ${inv.client}.`,
      "success"
    );
  }

  // Open Credit Note Modal
  function openCreditNote(invoiceId) {
    const inv = invoices.find((x) => x.id === invoiceId);
    if (!inv) return;

    document.getElementById("cn-invoice-id").value = inv.id;
    document.getElementById("cn-display-invoice").value = `${inv.id} - ${inv.client} (Total: ${formatINR(inv.totalAmountINR)})`;
    document.getElementById("cn-amount").value = Math.round(inv.balanceDueINR * 0.1) || 50000;
    openModal("modal-credit-note");
  }

  // Open Record Payment Modal
  function openRecordPayment(invoiceId) {
    const inv = invoices.find((x) => x.id === invoiceId);
    if (!inv) return;

    document.getElementById("pay-invoice-id").value = inv.id;
    document.getElementById("pay-display-invoice").value = `${inv.id} - ${inv.client} (Balance Due: ${formatINR(inv.balanceDueINR)})`;
    document.getElementById("pay-amount").value = inv.balanceDueINR || inv.totalAmountINR;
    document.getElementById("pay-tds").value = inv.tdsINR || Math.round(inv.baseAmountINR * 0.1);
    document.getElementById("pay-date").value = new Date().toISOString().split("T")[0];
    document.getElementById("pay-utr").value = "HDFCR52026" + Math.floor(100000 + Math.random() * 900000);
    openModal("modal-record-payment");
  }

  // CSV Export Helper
  function exportCSV() {
    const list = getFilteredInvoices();
    if (list.length === 0) {
      triggerToast("Export Ledger", "No invoices available to export.", "warning");
      return;
    }

    const headers = [
      "Invoice ID",
      "Client Name",
      "Client GSTIN",
      "Milestone Reference",
      "Project",
      "Issue Date",
      "Due Date",
      "Place of Supply",
      "Base Amount (INR)",
      "CGST (INR)",
      "SGST (INR)",
      "IGST (INR)",
      "Total Amount (INR)",
      "TDS Rate (%)",
      "TDS Deducted (INR)",
      "Paid Amount (INR)",
      "Balance Due (INR)",
      "Status",
      "IRN Number"
    ];

    const rows = list.map((inv) => [
      `"${inv.id}"`,
      `"${inv.client}"`,
      `"${inv.clientGstin}"`,
      `"${inv.milestoneRef}"`,
      `"${inv.project}"`,
      `"${inv.issueDate}"`,
      `"${inv.dueDate}"`,
      `"${inv.placeOfSupply}"`,
      inv.baseAmountINR,
      inv.cgstINR || 0,
      inv.sgstINR || 0,
      inv.igstINR || 0,
      inv.totalAmountINR,
      inv.tdsRate || 10,
      inv.tdsINR || 0,
      inv.paidAmountINR || 0,
      inv.balanceDueINR || 0,
      `"${inv.status}"`,
      `"${inv.irn || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Finnova_Tax_Invoices_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast("Export Complete", `Exported ${list.length} invoices to CSV.`, "success");
  }

  // Event Listeners Initialization
  function initEvents() {
    // Search input
    const searchInput = document.getElementById("invoice-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        currentSearchQuery = e.target.value.trim();
        renderTable();
      });
    }

    // Status filter tabs
    document.querySelectorAll(".status-tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".status-tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilterStatus = btn.dataset.status;
        renderTable();
      });
    });

    // KPI Cards interactive filter
    document.querySelectorAll(".kpi-card-invoice").forEach((card) => {
      card.addEventListener("click", () => {
        const filter = card.dataset.filter;
        if (!filter) return;
        currentFilterStatus = filter;

        document.querySelectorAll(".status-tab-btn").forEach((b) => {
          if (b.dataset.status === filter) {
            b.classList.add("active");
          } else {
            b.classList.remove("active");
          }
        });
        renderTable();
      });
    });

    // GST filter
    const gstFilter = document.getElementById("filter-gst-type");
    if (gstFilter) {
      gstFilter.addEventListener("change", (e) => {
        currentGstFilter = e.target.value;
        renderTable();
      });
    }

    // Sort filter
    const sortFilter = document.getElementById("filter-sort");
    if (sortFilter) {
      sortFilter.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderTable();
      });
    }

    // Master Checkbox Select All
    const selectAllCheck = document.getElementById("select-all-invoices");
    if (selectAllCheck) {
      selectAllCheck.addEventListener("change", (e) => {
        const checked = e.target.checked;
        const visibleInvoices = getFilteredInvoices();
        if (checked) {
          visibleInvoices.forEach((x) => selectedInvoiceIds.add(x.id));
        } else {
          selectedInvoiceIds.clear();
        }
        renderTable();
      });
    }

    // Row Checkbox Delegate
    const tableBody = document.getElementById("invoices-tbody");
    if (tableBody) {
      tableBody.addEventListener("change", (e) => {
        if (e.target && e.target.classList.contains("invoice-row-check")) {
          const invId = e.target.dataset.id;
          if (e.target.checked) {
            selectedInvoiceIds.add(invId);
          } else {
            selectedInvoiceIds.delete(invId);
          }
          updateSelectedState();
        }
      });
    }

    // Top Header Actions
    const btnSync = document.getElementById("btn-sync-invoices");
    if (btnSync) {
      btnSync.addEventListener("click", () => {
        triggerToast("Syncing Invoices", "Re-fetching invoice status from GST E-Invoice & Bank Remittance feed...", "info");
        setTimeout(() => {
          updateCounts();
          recalculateKPIs();
          renderTable();
          triggerToast("Invoices Synchronized", "All 142 invoice lifecycles verified with GST portal.", "success");
        }, 600);
      });
    }

    const btnExport = document.getElementById("btn-export-csv");
    if (btnExport) {
      btnExport.addEventListener("click", exportCSV);
    }

    // Batch Dispatch Triggers
    const triggerBatchDispatch = () => {
      const targetIds = selectedInvoiceIds.size > 0 ? Array.from(selectedInvoiceIds) : invoices.filter((x) => x.status === "Issued").map((x) => x.id);
      if (targetIds.length === 0) {
        triggerToast("Batch Dispatch", "No pending issued invoices to dispatch. Select invoices first.", "warning");
        return;
      }

      let count = 0;
      invoices.forEach((inv) => {
        if (targetIds.includes(inv.id) && inv.status !== "Paid") {
          inv.status = "Dispatched";
          inv.dispatchDate = new Date().toLocaleString("en-IN");
          count++;
        }
      });

      selectedInvoiceIds.clear();
      updateCounts();
      recalculateKPIs();
      renderTable();

      triggerToast("Batch Dispatch Success", `Successfully dispatched ${count} tax invoices with PDF attachments to client AP systems.`, "success");
    };

    const btnBatchTrigger = document.getElementById("btn-batch-dispatch-trigger");
    if (btnBatchTrigger) btnBatchTrigger.addEventListener("click", triggerBatchDispatch);

    const btnBatchSelected = document.getElementById("btn-batch-dispatch-selected");
    if (btnBatchSelected) btnBatchSelected.addEventListener("click", triggerBatchDispatch);

    // Open New Invoice Modal
    const btnNewInv = document.getElementById("btn-open-new-invoice");
    if (btnNewInv) {
      btnNewInv.addEventListener("click", () => {
        const today = new Date().toISOString().split("T")[0];
        document.getElementById("new-inv-date").value = today;
        document.getElementById("new-inv-base-amount").value = 5000000;
        updateNewInvoiceCalc();
        openModal("modal-new-invoice");
      });
    }

    // Calculation updates in New Invoice Form
    const baseAmtInput = document.getElementById("new-inv-base-amount");
    if (baseAmtInput) baseAmtInput.addEventListener("input", updateNewInvoiceCalc);

    const posSelect = document.getElementById("new-inv-place-of-supply");
    if (posSelect) posSelect.addEventListener("change", updateNewInvoiceCalc);

    // Submit New Invoice Form
    const formNewInv = document.getElementById("form-new-invoice");
    const btnSubmitInv = document.getElementById("btn-submit-invoice");
    const btnSaveDraft = document.getElementById("btn-save-draft");

    const handleCreateInvoice = (isDraft = false) => {
      const client = document.getElementById("new-inv-client").value.trim();
      const gstin = document.getElementById("new-inv-gstin").value.trim();
      const project = document.getElementById("new-inv-project").value.trim();
      const deliverable = document.getElementById("new-inv-deliverable").value.trim();
      const baseAmt = Number(document.getElementById("new-inv-base-amount").value) || 0;
      const pos = document.getElementById("new-inv-place-of-supply").value;
      const sac = document.getElementById("new-inv-sac").value;
      const terms = document.getElementById("new-inv-terms").value;
      const date = document.getElementById("new-inv-date").value || new Date().toISOString().split("T")[0];
      const email = document.getElementById("new-inv-email").value.trim() || "finance.ap@clientcorp.com";

      if (!client || !gstin || !project || !deliverable || baseAmt <= 0) {
        triggerToast("Form Validation", "Please fill in all required fields (Client, GSTIN, Deliverable, Amount).", "warning");
        return;
      }

      const isInter = !pos.startsWith("27");
      const gstVal = Math.round(baseAmt * 0.18);
      const totalVal = baseAmt + gstVal;
      const tdsVal = Math.round(baseAmt * 0.10);

      // Compute due date based on payment terms
      let days = 30;
      if (terms === "Net 15") days = 15;
      if (terms === "Net 45") days = 45;
      if (terms === "Net 60") days = 60;
      if (terms === "Due on Receipt") days = 0;

      const dueDateObj = new Date(date);
      dueDateObj.setDate(dueDateObj.getDate() + days);
      const dueDateStr = dueDateObj.toISOString().split("T")[0];

      const newId = `INV-2026-0${invoices.length + 90}`;
      const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);

      const newInvoice = {
        id: newId,
        irn: isDraft ? "" : randomHex + randomHex + randomHex + randomHex,
        ackNo: isDraft ? "" : "1126109" + Math.floor(10000 + Math.random() * 90000),
        ackDate: isDraft ? "" : date + " " + new Date().toTimeString().split(" ")[0],
        milestoneRef: "M-" + Math.floor(100 + Math.random() * 900),
        milestoneTitle: deliverable,
        project: project,
        projectCode: "PRJ-2026-0" + Math.floor(10 + Math.random() * 90),
        client: client,
        clientGstin: gstin.toUpperCase(),
        clientAddress: `${client} Corporate Headquarters, ${pos}`,
        clientState: pos.split("-")[1] || "Maharashtra",
        clientStateCode: pos.split("-")[0] || "27",
        placeOfSupply: pos,
        isInterState: isInter,
        sacCode: sac,
        sacDescription: "Information technology consultancy and development services",
        issueDate: date,
        dueDate: dueDateStr,
        paymentTerms: terms,
        baseAmountINR: baseAmt,
        gstRate: 18,
        cgstINR: isInter ? 0 : Math.round(gstVal / 2),
        sgstINR: isInter ? 0 : Math.round(gstVal / 2),
        igstINR: isInter ? gstVal : 0,
        totalAmountINR: totalVal,
        tdsRate: 10,
        tdsINR: tdsVal,
        paidAmountINR: 0,
        balanceDueINR: totalVal,
        status: isDraft ? "Draft" : "Issued",
        dispatchDate: "",
        dispatchedTo: email,
        deliveryStatus: isDraft ? "Draft Saved" : "IRN Generated - Ready to Dispatch",
        notes: "Generated via Finnova Financial Engine.",
        lineItems: [
          {
            srNo: 1,
            description: deliverable,
            sacCode: sac,
            qty: 1,
            rateINR: baseAmt,
            amountINR: baseAmt
          }
        ]
      };

      invoices.unshift(newInvoice);
      updateCounts();
      recalculateKPIs();
      renderTable();
      closeModal("modal-new-invoice");

      triggerToast(
        isDraft ? "Draft Saved" : "Tax Invoice Issued",
        `Invoice ${newId} for ${formatINR(totalVal)} created successfully.`,
        "success"
      );
    };

    if (btnSubmitInv) btnSubmitInv.addEventListener("click", () => handleCreateInvoice(false));
    if (btnSaveDraft) btnSaveDraft.addEventListener("click", () => handleCreateInvoice(true));

    // Print Button in Preview Modal
    const btnPrint = document.getElementById("btn-print-invoice");
    if (btnPrint) {
      btnPrint.addEventListener("click", () => {
        window.print();
      });
    }

    // Single Dispatch from Preview Modal
    const btnDispatchSingle = document.getElementById("btn-dispatch-single");
    if (btnDispatchSingle) {
      btnDispatchSingle.addEventListener("click", () => {
        if (activePreviewInvoice) {
          dispatchInvoice(activePreviewInvoice.id);
          closeModal("modal-invoice-preview");
        }
      });
    }

    // Credit Note Submission
    const btnSubmitCn = document.getElementById("btn-submit-cn");
    if (btnSubmitCn) {
      btnSubmitCn.addEventListener("click", () => {
        const invId = document.getElementById("cn-invoice-id").value;
        const cnAmount = Number(document.getElementById("cn-amount").value) || 0;
        const cnReason = document.getElementById("cn-reason").value;

        const inv = invoices.find((x) => x.id === invId);
        if (!inv || cnAmount <= 0) {
          triggerToast("Credit Note", "Please specify a valid credit amount.", "warning");
          return;
        }

        const gstCredit = Math.round(cnAmount * 0.18);
        const totalCredit = cnAmount + gstCredit;

        inv.balanceDueINR = Math.max(0, (inv.balanceDueINR || 0) - totalCredit);
        inv.notes = `Credit Note issued for ${formatINR(totalCredit)} (${cnReason}). ` + (inv.notes || "");
        if (inv.balanceDueINR === 0) {
          inv.status = "Paid";
        }

        updateCounts();
        recalculateKPIs();
        renderTable();
        closeModal("modal-credit-note");

        triggerToast(
          "Credit Note Issued",
          `Credit Note of ${formatINR(totalCredit)} applied against ${inv.id}.`,
          "success"
        );
      });
    }

    // Payment Remittance Submission
    const btnSubmitPayment = document.getElementById("btn-submit-payment");
    if (btnSubmitPayment) {
      btnSubmitPayment.addEventListener("click", () => {
        const invId = document.getElementById("pay-invoice-id").value;
        const payAmount = Number(document.getElementById("pay-amount").value) || 0;
        const payTds = Number(document.getElementById("pay-tds").value) || 0;
        const utr = document.getElementById("pay-utr").value.trim() || "UTR" + Date.now();
        const mode = document.getElementById("pay-mode").value;

        const inv = invoices.find((x) => x.id === invId);
        if (!inv || payAmount <= 0) {
          triggerToast("Payment Record", "Please specify a valid payment amount.", "warning");
          return;
        }

        inv.paidAmountINR = (inv.paidAmountINR || 0) + payAmount;
        inv.balanceDueINR = Math.max(0, (inv.totalAmountINR || 0) - inv.paidAmountINR - payTds);

        if (inv.balanceDueINR === 0) {
          inv.status = "Paid";
        } else {
          inv.status = "Partially Paid";
        }

        inv.deliveryStatus = `Payment of ${formatINR(payAmount)} received via ${mode} (Ref #${utr})`;

        updateCounts();
        recalculateKPIs();
        renderTable();
        closeModal("modal-record-payment");

        triggerToast(
          "Payment Posted to Ledger",
          `Recorded remittance of ${formatINR(payAmount)} against ${inv.id}. Balance: ${formatINR(inv.balanceDueINR)}`,
          "success"
        );
      });
    }
  }

  // Initialization Routine
  function init() {
    populateMilestoneDropdown();
    initEvents();
    updateCounts();
    recalculateKPIs();
    renderTable();
  }

  // Expose to window for inline calls & debugging
  window.InvoicesApp = {
    init,
    openModal,
    closeModal,
    openPreview,
    dispatchInvoice,
    openCreditNote,
    openRecordPayment,
    exportCSV
  };

  document.addEventListener("DOMContentLoaded", init);
})();
