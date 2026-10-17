/**
 * Finnova M-RAL - Overview Module Mock Data
 * Indian Enterprise INR Edition
 * 
 * Contains executive KPI metrics, milestone pipeline records, recent activity,
 * and ledger milestone details specific to the Overview dashboard.
 */

(function () {
  const OVERVIEW_DATA = {
    // Executive KPI Metrics for Overview Dashboard (Realistic CA / IT Services INR Range)
    kpiMetrics: {
      activeProjects: {
        value: "28 Projects",
        change: "+3 this month",
        trend: "positive",
        subtitle: "₹34.80 Cr Portfolio Contract Value"
      },
      milestonesAwaitingReadiness: {
        value: "14 Milestones",
        change: "4 high-priority",
        trend: "neutral",
        subtitle: "Valued at ₹4.85 Cr across 6 key accounts"
      },
      milestonesAwaitingAcceptance: {
        value: "9 Milestones",
        change: "2 pending > 7 days",
        trend: "negative",
        subtitle: "₹3.12 Cr pending client sign-off"
      },
      acceptedUnbilledValue: {
        value: "₹2.45 Cr",
        change: "Ready to bill",
        trend: "positive",
        subtitle: "Eligible for immediate GST invoice release"
      },
      outstandingReceivables: {
        value: "₹6.82 Cr",
        change: "DSO: 38.5 Days",
        trend: "neutral",
        subtitle: "Weighted average payment term: Net 30"
      },
      overdueInvoices: {
        value: "₹1.18 Cr",
        change: "7 overdue notices",
        trend: "negative",
        subtitle: "2 invoices in 30+ day aging bracket"
      },
      currentCashPosition: {
        value: "₹18.45 Cr",
        change: "+12.4% vs target",
        trend: "positive",
        subtitle: "Primary operating accounts buffer 142%"
      },
      forecastFundingGap: {
        value: "₹0 (Zero Deficit)",
        change: "30-day runway secure",
        trend: "positive",
        subtitle: "Net liquidity cushion of +₹4.15 Cr projected"
      }
    },

    // Milestone Acceptance Pipeline Rows (Indian Corporate Accounts & ₹ Lakh/Crore Range)
    milestonePipeline: [
      {
        code: "PRJ-2026-004",
        project: "Tata Omnichannel Cloud Migration",
        client: "Tata Digital Enterprises (Mumbai)",
        milestone: "M-402: Core Database Cutover & GST Audit",
        value: "₹85,00,000",
        valueINR: 8500000,
        dueDate: "2026-03-28",
        readinessStatus: "Ready",
        readinessBadge: "success",
        acceptanceStatus: "Awaiting Client Sign-Off",
        acceptanceBadge: "warning",
        billingStatus: "Pending Acceptance"
      },
      {
        code: "PRJ-2026-009",
        project: "HDFC Core Banking API Upgrade",
        client: "HDFC Banking Solutions (Mumbai)",
        milestone: "M-301: NEFT/RTGS Clearing Gateway Test",
        value: "₹1,25,00,000",
        valueINR: 12500000,
        dueDate: "2026-03-20",
        readinessStatus: "Ready",
        readinessBadge: "success",
        acceptanceStatus: "Client Accepted",
        acceptanceBadge: "success",
        billingStatus: "Ready to Bill"
      },
      {
        code: "PRJ-2026-012",
        project: "Reliance Supply Chain ERP Integration",
        client: "Reliance Retail Logistics (Navi Mumbai)",
        milestone: "M-204: Automated Customs & E-Way Bill API",
        value: "₹42,00,000",
        valueINR: 4200000,
        dueDate: "2026-04-05",
        readinessStatus: "In Review",
        readinessBadge: "warning",
        acceptanceStatus: "Prerequisites Open",
        acceptanceBadge: "neutral",
        billingStatus: "Unearned"
      },
      {
        code: "PRJ-2026-017",
        project: "Infosys Healthcare Compliance Portal",
        client: "Infosys Health Systems (Bengaluru)",
        milestone: "M-501: DISHA & HIPAA Security Sign-Off",
        value: "₹64,00,000",
        valueINR: 6400000,
        dueDate: "2026-03-15",
        readinessStatus: "Blocked",
        readinessBadge: "danger",
        acceptanceStatus: "Exception Escalated",
        acceptanceBadge: "danger",
        billingStatus: "Hold"
      },
      {
        code: "PRJ-2026-021",
        project: "Mahindra Smart Grid IoT Telemetry",
        client: "Mahindra Power Utilities (Pune)",
        milestone: "M-103: SCADA Integration Pilot",
        value: "₹98,00,000",
        valueINR: 9800000,
        dueDate: "2026-03-24",
        readinessStatus: "Ready",
        readinessBadge: "success",
        acceptanceStatus: "Client Accepted",
        acceptanceBadge: "success",
        billingStatus: "Ready to Bill"
      }
    ],

    // Recent Activity Feed
    recentActivity: [
      {
        id: "act-1",
        type: "acceptance",
        title: "Client Acceptance Signed",
        desc: "HDFC Banking Solutions signed off Milestone M-301 (₹1.25 Cr). Ready for billing release.",
        timestamp: "24 mins ago",
        badge: "success"
      },
      {
        id: "act-2",
        type: "readiness",
        title: "Readiness Gateway Cleared",
        desc: "Tata Digital M-402 passed Delivery Readiness review.",
        timestamp: "1 hour ago",
        badge: "info"
      },
      {
        id: "act-3",
        type: "collection",
        title: "Cash Receipt Reconciled",
        desc: "RTGS transfer of ₹68.0 L matched against INV-2026-048 (Mahindra Power).",
        timestamp: "3 hours ago",
        badge: "success"
      },
      {
        id: "act-4",
        type: "risk",
        title: "Acceptance Dispute Logged",
        desc: "Milestone M-501 flagged for clause 8.2 audit requirement clarification.",
        timestamp: "Yesterday at 16:40",
        badge: "danger"
      }
    ],

    // Detailed Milestones Dataset for Ledger Table & Kanban Board
    milestones: [
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
    ]
  };

  // Export to window
  window.OVERVIEW_DATA = OVERVIEW_DATA;
  window.FINNOVA_OVERVIEW_DATA = OVERVIEW_DATA;

  // Backwards compatibility alias if shell accessed mock data
  if (window.FINNOVA_MOCK_DATA) {
    Object.assign(window.FINNOVA_MOCK_DATA, {
      kpiMetrics: OVERVIEW_DATA.kpiMetrics,
      milestonePipeline: OVERVIEW_DATA.milestonePipeline,
      recentActivity: OVERVIEW_DATA.recentActivity
    });
  }
})();
