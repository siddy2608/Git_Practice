/**
 * Finnova M-RAL - Shared Shell Data
 * Contains system-wide data required by the application shell (users, notifications).
 * Module-specific data is maintained independently within each module's `data.js`.
 */

(function () {
  const FINNOVA_SHELL_DATA = {
    // Pre-seeded Demo Accounts
    users: [
      {
        id: "usr_admin_01",
        email: "admin@finnova.io",
        // Plain text password solely for client-side prototype demonstration
        password: "Admin@1234",
        fullName: "Eleanor Vance",
        organization: "Finnova Advisory Services India Ltd.",
        role: "Administrator",
        status: "Active",
        avatarInitials: "EV",
        createdAt: "2026-01-15T08:00:00Z"
      },
      {
        id: "usr_analyst_02",
        email: "analyst@finnova.io",
        password: "User@1234",
        fullName: "Sophia Chen",
        organization: "Finnova Advisory Services India Ltd.",
        role: "Company User",
        status: "Active",
        avatarInitials: "SC",
        createdAt: "2026-02-01T10:30:00Z"
      },
      {
        id: "usr_pending_03",
        email: "pending.user@clientcorp.com",
        password: "User@1234",
        fullName: "Vikram Malhotra",
        organization: "Tata Digital Enterprises (Mumbai)",
        role: "Pending",
        status: "Pending Approval",
        avatarInitials: "VM",
        createdAt: "2026-03-10T14:15:00Z"
      }
    ],

    // Mock Notifications for Header Bell
    notifications: [
      {
        id: "notif-1",
        title: "Milestone Acceptance Completed",
        desc: "HDFC Banking Solutions accepted Milestone M-301 (₹1.25 Cr). Billing unlocked.",
        time: "24m ago",
        unread: true,
        type: "success"
      },
      {
        id: "notif-2",
        title: "GST Invoice Approaching Due Date",
        desc: "INV-2026-081 (₹34.0 L) for Reliance Retail is due in 48 hours.",
        time: "2h ago",
        unread: true,
        type: "warning"
      },
      {
        id: "notif-3",
        title: "30-Day Liquidity Forecast Updated",
        desc: "Treasury projection shows operating headroom above ₹18.45 Cr baseline.",
        time: "5h ago",
        unread: true,
        type: "info"
      }
    ]
  };

  // Export to window
  window.FINNOVA_SHELL_DATA = FINNOVA_SHELL_DATA;
  // Backward compatibility alias for storage and shell services
  window.FINNOVA_MOCK_DATA = FINNOVA_SHELL_DATA;
})();
