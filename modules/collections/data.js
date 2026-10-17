/**
 * Finnova M-RAL - Collections Management Mock Data
 * Indian Enterprise INR Edition (Lakhs & Crores)
 * 
 * Contains Accounts Receivable (AR) aging portfolio, client credit profiles,
 * multi-tier dunning letter templates, open disputes, and payment receipts.
 */

(function () {
  const DATA = {
    moduleId: "collections",
    title: "Collections Management",
    standard: "INR (₹) Lakhs/Crores",

    // Executive KPI Summary
    kpis: {
      totalReceivables: {
        valueINR: 68200000,
        formatted: "₹6.82 Cr",
        accountCount: 18,
        trend: "DSO: 38.5 Days",
        trendType: "positive",
        subtext: "↓ -3.2 days vs last month"
      },
      currentNotDue: {
        valueINR: 39500000,
        formatted: "₹3.95 Cr",
        pct: "57.9%",
        trend: "Healthy Flow",
        trendType: "positive",
        subtext: "0-30 days aging bracket"
      },
      overdue31to60: {
        valueINR: 16800000,
        formatted: "₹1.68 Cr",
        pct: "24.6%",
        trend: "Follow-up Active",
        trendType: "neutral",
        subtext: "Dunning Level 1 & 2 dispatched"
      },
      criticalOverdue61Plus: {
        valueINR: 11900000,
        formatted: "₹1.19 Cr",
        pct: "17.5%",
        trend: "4 Accounts at Risk",
        trendType: "negative",
        subtext: "Escalated to CFO / Legal desk"
      },
      ptpPipeline: {
        valueINR: 8500000,
        formatted: "₹85.00 L",
        trend: "Due this week",
        trendType: "positive",
        subtext: "Promised-to-Pay commitments"
      },
      collectionEfficiency: {
        value: "91.4%",
        trend: "↑ +2.8%",
        trendType: "positive",
        subtext: "Target efficiency > 90%"
      }
    },

    // Aging Spectrum Summary (for visual interactive bar)
    agingSpectrum: [
      { bucket: "Current (0-30d)", valueINR: 39500000, pct: 57.9, colorVar: "--color-success", statusFilter: "CURRENT" },
      { bucket: "31-60 Days", valueINR: 16800000, pct: 24.6, colorVar: "--color-info", statusFilter: "31-60" },
      { bucket: "61-90 Days", valueINR: 7500000, pct: 11.0, colorVar: "--color-warning", statusFilter: "61-90" },
      { bucket: "90+ Days Critical", valueINR: 4400000, pct: 6.5, colorVar: "--color-danger", statusFilter: "90+" }
    ],

    // Dunning Letter Templates (Compliant with Indian Corporate Law & MSMED Act 2006)
    dunningTemplates: {
      LEVEL_1: {
        level: "Level 1 - Courtesy Reminder",
        subject: "Courtesy Reminder: Statement of Account and Upcoming Settlement for [ClientName]",
        tone: "Polite & Collaborative",
        content: `Dear Finance & Accounts Team,

We trust this message finds you well.

This is a gentle reminder regarding the outstanding milestone invoice(s) under our active Master Services Agreement. As per our mutual payment terms of Net 30 days, invoice(s) totaling [OverdueAmountINR] are currently due for settlement.

We have attached the certified milestone acceptance sign-offs and GST E-Invoices for your verification. Kindly let us know if you require any additional supporting documentation or tax clearance to release the remittance.

We would appreciate it if you could confirm the scheduled NEFT/RTGS payment date at your earliest convenience.`
      },
      LEVEL_2: {
        level: "Level 2 - Formal Demand Notice",
        subject: "Second Notice: Overdue Accounts Receivable Statement for [ClientName]",
        tone: "Firm & Professional",
        content: `Dear Accounts Payable Head,

We are writing to follow up on our previous communication regarding overdue invoice(s) amounting to [OverdueAmountINR], which have now exceeded the agreed Net 30 payment terms by [OverdueDays] days.

Prompt settlement of milestone deliverables is essential to maintain delivery velocity and resource allocation for the project. Please expedite the processing of the attached invoices and advise us of the bank UTR reference once the transfer is executed.

If there are any unresolved queries regarding deliverables or TDS deductions (Form 16A), please connect with your designated credit controller immediately.`
      },
      LEVEL_3: {
        level: "Level 3 - Executive CFO Escalation",
        subject: "URGENT: Executive Escalation — Overdue Payment Notice ([ClientName])",
        tone: "Urgent & High-Level",
        content: `Dear Chief Financial Officer / Finance Controller,

This is a formal executive notice from the Office of the CFO at Finnova Technologies.

Despite multiple reminders, invoice(s) amounting to [OverdueAmountINR] under project '[ProjectName]' remain unsettled for over 60 days. Continued delay in payment places milestone delivery milestones and SLA commitments at severe risk of suspension.

We request your urgent intervention to authorize immediate bank remittance within five (5) business days to prevent operational disruption and formal dispute escalation.`
      },
      LEVEL_4: {
        level: "Level 4 - Legal Demand under MSMED Act",
        subject: "FINAL LEGAL NOTICE: Demand for Immediate Settlement under MSMED Act 2006",
        tone: "Legal & Binding",
        content: `WITHOUT PREJUDICE

To: The Board of Directors / Chief Financial Officer, [ClientName]

RE: FINAL DEMAND FOR IMMEDIATE PAYMENT OF OUTSTANDING DUES OF [OverdueAmountINR]

Under the provisions of Section 15 and 16 of the Micro, Small and Medium Enterprises Development (MSMED) Act, 2006, payment for delivered goods and services is mandated within 45 days. Delayed payments attract statutory compound interest with monthly rests at three times the Bank Rate notified by the Reserve Bank of India.

Take notice that unless the full outstanding sum of [OverdueAmountINR] is credited to our bank account within seven (7) days of this notice, we shall initiate statutory proceedings before the MSME Facilitation Council and pursue all available commercial remedies at your sole risk and costs.`
      }
    },

    // Accounts Receivable Ledger Rows
    accounts: [
      {
        id: "AR-ACC-001",
        client: "Tata Digital Enterprises",
        clientGstin: "27AABCT2418Q1ZV",
        contactPerson: "Rajesh Kulkarni (VP Finance)",
        contactEmail: "rajesh.k@tatadigital.com",
        contactPhone: "+91 98201 44821",
        creditLimitINR: 20000000,
        totalOutstandingINR: 5030000,
        aging: {
          currentINR: 0,
          days31to60INR: 5030000,
          days61to90INR: 0,
          days90plusINR: 0
        },
        oldestInvoiceId: "INV-2026-088",
        oldestInvoiceDate: "2026-02-24",
        oldestDueDate: "2026-03-26",
        overdueDays: 0,
        agingBucket: "31-60",
        dunningLevel: "None",
        dunningLevelNum: 0,
        riskRating: "Low",
        riskScore: 24,
        hasDispute: false,
        disputeId: null,
        ptpDate: "2026-03-24",
        ptpAmountINR: 5030000,
        collectorOwner: "Aakash Mehta",
        lastActivity: "Partial payment of ₹50.00 L received. Balance promised by Mar 24.",
        history: [
          { date: "2026-03-05", type: "Payment", desc: "Received ₹50,00,000 via RTGS (UTR #HDFCR52026030501)" },
          { date: "2026-02-25", type: "Dispatch", desc: "Invoice INV-2026-088 dispatched via email" }
        ]
      },
      {
        id: "AR-ACC-002",
        client: "HDFC Banking Solutions",
        clientGstin: "27AAACH2702H1ZQ",
        contactPerson: "Meera Nair (Head of Treasury AP)",
        contactEmail: "meera.nair@hdfcbank.com",
        contactPhone: "+91 98210 55190",
        creditLimitINR: 25000000,
        totalOutstandingINR: 14750000,
        aging: {
          currentINR: 14750000,
          days31to60INR: 0,
          days61to90INR: 0,
          days90plusINR: 0
        },
        oldestInvoiceId: "INV-2026-089",
        oldestInvoiceDate: "2026-03-01",
        oldestDueDate: "2026-03-31",
        overdueDays: 0,
        agingBucket: "CURRENT",
        dunningLevel: "None",
        dunningLevelNum: 0,
        riskRating: "Low",
        riskScore: 12,
        hasDispute: false,
        disputeId: null,
        ptpDate: "2026-03-28",
        ptpAmountINR: 14750000,
        collectorOwner: "Pooja Sharma",
        lastActivity: "Milestone certificate signed. Settlement approved for Mar 28 run.",
        history: [
          { date: "2026-03-02", type: "Dispatch", desc: "Tax Invoice INV-2026-089 sent with IRN acknowledgment" },
          { date: "2026-03-01", type: "Invoice", desc: "Issued for NEFT/RTGS Clearing Gateway Test" }
        ]
      },
      {
        id: "AR-ACC-003",
        client: "Reliance Retail Logistics",
        clientGstin: "27AABCR0365F1ZT",
        contactPerson: "Sunil Deshmukh (GM Commercial)",
        contactEmail: "sunil.deshmukh@ril.com",
        contactPhone: "+91 97690 32188",
        creditLimitINR: 15000000,
        totalOutstandingINR: 4956000,
        aging: {
          currentINR: 0,
          days31to60INR: 4956000,
          days61to90INR: 0,
          days90plusINR: 0
        },
        oldestInvoiceId: "INV-2026-086",
        oldestInvoiceDate: "2026-01-28",
        oldestDueDate: "2026-02-27",
        overdueDays: 18,
        agingBucket: "31-60",
        dunningLevel: "Level 2",
        dunningLevelNum: 2,
        riskRating: "Medium",
        riskScore: 54,
        hasDispute: false,
        disputeId: null,
        ptpDate: "2026-03-22",
        ptpAmountINR: 4956000,
        collectorOwner: "Aakash Mehta",
        lastActivity: "Level 2 Dunning notice dispatched. AP promised release on Mar 22.",
        history: [
          { date: "2026-03-08", type: "Dunning", desc: "Level 2 Formal Demand Notice sent to GM Commercial" },
          { date: "2026-02-28", type: "Dunning", desc: "Level 1 Courtesy Reminder dispatched" },
          { date: "2026-01-29", type: "Dispatch", desc: "Tax Invoice INV-2026-086 dispatched" }
        ]
      },
      {
        id: "AR-ACC-004",
        client: "Larsen & Toubro Heavy Infrastructure",
        clientGstin: "27AAACL0987P1ZG",
        contactPerson: "Vikram Sengupta (Sr Manager Accounts)",
        contactEmail: "vikram.s@larsentoubro.com",
        contactPhone: "+91 99300 81234",
        creditLimitINR: 18000000,
        totalOutstandingINR: 6136000,
        aging: {
          currentINR: 0,
          days31to60INR: 0,
          days61to90INR: 6136000,
          days90plusINR: 0
        },
        oldestInvoiceId: "INV-2026-084",
        oldestInvoiceDate: "2026-01-08",
        oldestDueDate: "2026-02-07",
        overdueDays: 38,
        agingBucket: "61-90",
        dunningLevel: "Level 2",
        dunningLevelNum: 2,
        riskRating: "High",
        riskScore: 72,
        hasDispute: true,
        disputeId: "DISP-2026-014",
        disputeReason: "Site engineer milestone acceptance certification document pending",
        ptpDate: "2026-03-30",
        ptpAmountINR: 6136000,
        collectorOwner: "Rohan Varma",
        lastActivity: "Dispute under review with delivery head. Client held tranche pending sign-off.",
        history: [
          { date: "2026-03-10", type: "Dispute", desc: "Dispute logged: Client site verification documentation gap" },
          { date: "2026-02-20", type: "Dunning", desc: "Level 2 Demand Notice dispatched" },
          { date: "2026-02-10", type: "Dunning", desc: "Level 1 Reminder dispatched" }
        ]
      },
      {
        id: "AR-ACC-005",
        client: "Bharti Airtel Enterprise",
        clientGstin: "06AAACB1201B1ZK",
        contactPerson: "Ananya Roy (Commercial Controller)",
        contactEmail: "ananya.roy@airtel.in",
        contactPhone: "+91 98100 45678",
        creditLimitINR: 20000000,
        totalOutstandingINR: 10856000,
        aging: {
          currentINR: 0,
          days31to60INR: 0,
          days61to90INR: 0,
          days90plusINR: 10856000
        },
        oldestInvoiceId: "INV-2026-083",
        oldestInvoiceDate: "2025-12-28",
        oldestDueDate: "2026-01-27",
        overdueDays: 49,
        agingBucket: "90+",
        dunningLevel: "Level 3",
        dunningLevelNum: 3,
        riskRating: "Critical",
        riskScore: 88,
        hasDispute: true,
        disputeId: "DISP-2026-009",
        disputeReason: "TDS section dispute: Client claiming Sec 194C (2%) vs Sec 194J (10%)",
        ptpDate: "2026-03-25",
        ptpAmountINR: 9936000,
        collectorOwner: "Rohan Varma",
        lastActivity: "CFO escalation call held on Mar 12. Resolution in progress for 194J rate.",
        history: [
          { date: "2026-03-12", type: "Escalation", desc: "CFO-level conciliation call with Airtel Commercial team" },
          { date: "2026-03-01", type: "Dunning", desc: "Level 3 Executive Notice dispatched" },
          { date: "2026-02-05", type: "Dispute", desc: "Commercial dispute filed regarding tax deduction rate" }
        ]
      },
      {
        id: "AR-ACC-006",
        client: "State Bank of India Payments",
        clientGstin: "27AAACS0458C1ZY",
        contactPerson: "Dinesh Parab (Chief Manager IT Finance)",
        contactEmail: "dinesh.parab@sbi.co.in",
        contactPhone: "+91 98202 33112",
        creditLimitINR: 30000000,
        totalOutstandingINR: 9204000,
        aging: {
          currentINR: 9204000,
          days31to60INR: 0,
          days61to90INR: 0,
          days90plusINR: 0
        },
        oldestInvoiceId: "INV-2026-090",
        oldestInvoiceDate: "2026-03-05",
        oldestDueDate: "2026-04-04",
        overdueDays: 0,
        agingBucket: "CURRENT",
        dunningLevel: "None",
        dunningLevelNum: 0,
        riskRating: "Low",
        riskScore: 18,
        hasDispute: false,
        disputeId: null,
        ptpDate: "2026-04-02",
        ptpAmountINR: 9204000,
        collectorOwner: "Pooja Sharma",
        lastActivity: "Invoice draft approved. PSU payment workflow initiated on GeM portal.",
        history: [
          { date: "2026-03-06", type: "Workflow", desc: "Submitted to SBI IT procurement ledger" }
        ]
      },
      {
        id: "AR-ACC-007",
        client: "Wipro Digital Cloud",
        clientGstin: "29AAACW1122D1ZF",
        contactPerson: "Kavita Swaminathan (Billing Lead)",
        contactEmail: "kavita.s@wipro.com",
        contactPhone: "+91 98800 12903",
        creditLimitINR: 15000000,
        totalOutstandingINR: 6608000,
        aging: {
          currentINR: 6608000,
          days31to60INR: 0,
          days61to90INR: 0,
          days90plusINR: 0
        },
        oldestInvoiceId: "INV-2026-091",
        oldestInvoiceDate: "2026-03-08",
        oldestDueDate: "2026-04-07",
        overdueDays: 0,
        agingBucket: "CURRENT",
        dunningLevel: "None",
        dunningLevelNum: 0,
        riskRating: "Low",
        riskScore: 15,
        hasDispute: false,
        disputeId: null,
        ptpDate: "2026-04-05",
        ptpAmountINR: 6608000,
        collectorOwner: "Aakash Mehta",
        lastActivity: "E-Invoice IRN verified. Client system schedule matches Net 30.",
        history: [
          { date: "2026-03-09", type: "Dispatch", desc: "Tax Invoice INV-2026-091 acknowledged" }
        ]
      },
      {
        id: "AR-ACC-008",
        client: "Infosys Health Systems",
        clientGstin: "29AAACI4567J1ZM",
        contactPerson: "Arjun Hegde (Finance Controller)",
        contactEmail: "arjun.hegde@infosys.com",
        contactPhone: "+91 98450 67123",
        creditLimitINR: 12000000,
        totalOutstandingINR: 0,
        aging: {
          currentINR: 0,
          days31to60INR: 0,
          days61to90INR: 0,
          days90plusINR: 0
        },
        oldestInvoiceId: "INV-2026-087",
        oldestInvoiceDate: "2026-02-18",
        oldestDueDate: "2026-03-20",
        overdueDays: 0,
        agingBucket: "CURRENT",
        dunningLevel: "None",
        dunningLevelNum: 0,
        riskRating: "Low",
        riskScore: 5,
        hasDispute: false,
        disputeId: null,
        ptpDate: "",
        ptpAmountINR: 0,
        collectorOwner: "Pooja Sharma",
        lastActivity: "All invoices settled in full. Form 16A TDS certificates reconciled.",
        history: [
          { date: "2026-03-02", type: "Payment", desc: "Settled ₹75,52,000 in full via RTGS (UTR #ICICIR2026030219)" }
        ]
      },
      {
        id: "AR-ACC-009",
        client: "Mahindra Power Utilities",
        clientGstin: "27AAACM1234K1ZL",
        contactPerson: "Sachin Joshi (VP Commercial)",
        contactEmail: "sachin.joshi@mahindra.com",
        contactPhone: "+91 98220 90182",
        creditLimitINR: 10000000,
        totalOutstandingINR: 0,
        aging: {
          currentINR: 0,
          days31to60INR: 0,
          days61to90INR: 0,
          days90plusINR: 0
        },
        oldestInvoiceId: "INV-2026-085",
        oldestInvoiceDate: "2026-01-15",
        oldestDueDate: "2026-02-14",
        overdueDays: 0,
        agingBucket: "CURRENT",
        dunningLevel: "None",
        dunningLevelNum: 0,
        riskRating: "Low",
        riskScore: 8,
        hasDispute: false,
        disputeId: null,
        ptpDate: "",
        ptpAmountINR: 0,
        collectorOwner: "Aakash Mehta",
        lastActivity: "Zero balance outstanding. Consistent 28-day settlement cycle.",
        history: [
          { date: "2026-02-10", type: "Payment", desc: "Settled ₹44,84,000 via NEFT (UTR #SBINR52026021088)" }
        ]
      },
      {
        id: "AR-ACC-010",
        client: "Bajaj Auto Limited",
        clientGstin: "27AAACB3482F1ZR",
        contactPerson: "Makarand Patwardhan (Treasury Head)",
        contactEmail: "makarand.p@bajajauto.co.in",
        contactPhone: "+91 98500 44211",
        creditLimitINR: 14000000,
        totalOutstandingINR: 0,
        aging: {
          currentINR: 0,
          days31to60INR: 0,
          days61to90INR: 0,
          days90plusINR: 0
        },
        oldestInvoiceId: "INV-2026-082",
        oldestInvoiceDate: "2025-12-15",
        oldestDueDate: "2026-01-14",
        overdueDays: 0,
        agingBucket: "CURRENT",
        dunningLevel: "None",
        dunningLevelNum: 0,
        riskRating: "Low",
        riskScore: 7,
        hasDispute: false,
        disputeId: null,
        ptpDate: "",
        ptpAmountINR: 0,
        collectorOwner: "Pooja Sharma",
        lastActivity: "Settled in full on Jan 12. No active overdue receivables.",
        history: [
          { date: "2026-01-12", type: "Payment", desc: "Settled ₹56,64,000 via RTGS (UTR #AXISR52026011244)" }
        ]
      }
    ],

    // Active Disputes Ledger
    disputes: [
      {
        id: "DISP-2026-014",
        accountId: "AR-ACC-004",
        client: "Larsen & Toubro Heavy Infrastructure",
        invoiceId: "INV-2026-084",
        amountINR: 6136000,
        raisedDate: "2026-03-10",
        status: "Under Review",
        category: "Deliverable Sign-Off",
        summary: "Site engineer acceptance certificate documentation gap. Physical site cutover proof requested.",
        assignee: "Siddharth Mishra (Delivery Lead)",
        nextStep: "Delivery team uploading site telemetry logs and signed cutover memo."
      },
      {
        id: "DISP-2026-009",
        accountId: "AR-ACC-005",
        client: "Bharti Airtel Enterprise",
        invoiceId: "INV-2026-083",
        amountINR: 10856000,
        raisedDate: "2026-02-05",
        status: "In Conciliation",
        category: "TDS Rate Classification",
        summary: "Commercial team claiming Sec 194C (2% contractor rate) instead of Sec 194J (10% tech consultancy rate).",
        assignee: "Corporate Tax Desk & CFO Office",
        nextStep: "Joint tax memorandum with CA opinion dispatched to Airtel Head of Tax."
      }
    ]
  };

  window.FINNOVA_COLLECTIONS_DATA = DATA;
})();
