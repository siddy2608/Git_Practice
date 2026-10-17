# Finnova M-RAL Design System Specification

## 1. Overview & Design Direction

Finnova M-RAL is an enterprise project-to-cash financial governance platform designed for CFOs, VP Finance, and delivery executives. The design language reflects a **calm, trustworthy, data-dense, executive-grade fintech interface** (in the class of Stripe, Ramp, and Brex dashboards).

### Core Principles
- **Quiet Neutrals & Purposeful Color**: Neutrals (slate) create structure and whitespace. Color is reserved exclusively for semantic meaning: money direction, delivery health, workflow states, and primary actions.
- **Zero Gratuitous Decor**: No multi-color gradients on cards, no heavy drop shadows, no neon accents.
- **Tabular Precision**: Every currency amount, percentage, count, and invoice identifier uses `font-variant-numeric: tabular-nums` to guarantee vertical column alignment.
- **Canonical Design Tokens**: All CSS, JavaScript, and HTML components reference centralized custom properties defined in `core/css/base.css`. No hardcoded hex values exist outside `base.css`.
- **WCAG AA Compliance**: 4.5:1 text contrast and 3:1 UI component contrast across both Light and Dark themes.

---

## 2. Design Tokens

### 2.1 Primary Trust Blue
Used for primary navigation accents, focused states, and key call-to-actions.

| Token | Light Value | Usage |
| :--- | :--- | :--- |
| `--color-primary-50` | `#EEF4FF` | Tints, selected rows, info backgrounds |
| `--color-primary-100` | `#DCE8FF` | Light hover state |
| `--color-primary-200` | `#B9D0FF` | Subtle borders, light accents |
| `--color-primary-300` | `#8DB0F7` | Focus rings, card hover border |
| `--color-primary-400` | `#5C89EA` | Active accent bars, highlighted icons |
| `--color-primary-500` | `#3A67D6` | Primary accents |
| `--color-primary-600` | `#284FB8` | **Default Primary Button**, interactive links |
| `--color-primary-700` | `#1F3F94` | Primary hover state |
| `--color-primary-800` | `#1B3377` | Primary active / pressed state |
| `--color-primary-900` | `#172A5C` | Deep brand headers |

### 2.2 Accent Teal (Growth / Positive Cash)
Used for positive financial cash flows, client acceptance, and realization metrics.

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--color-accent-50` | `#E6F7F4` | Accent pill background |
| `--color-accent-500` | `#0F9D8A` | Accent line/border |
| `--color-accent-600` | `#0B7F70` | Accent text, positive indicators |

### 2.3 Executive Deep Navy Sidebar
Dedicated high-contrast sidebar tokens maintaining executive calm.

| Token | Value | Description |
| :--- | :--- | :--- |
| `--sidebar-bg` | `#0B1730` | Deep navy background |
| `--sidebar-hover` | `#12254A` | Nav item hover |
| `--sidebar-active-bg` | `#16306B` | Active nav item background |
| `--sidebar-active-bar` | `#5C89EA` | 3px left indicator bar |
| `--sidebar-text` | `#C9D5EE` | Standard nav text |
| `--sidebar-muted` | `#8A9BBF` | Group category labels, icons |
| `--sidebar-border` | `#1B2B4D` | Section divider border |

### 2.4 Neutrals & Surfaces (Light Theme)

| Token | Value | Description |
| :--- | :--- | :--- |
| `--bg-page` | `#F5F7FA` | Canvas / application background |
| `--bg-surface` | `#FFFFFF` | Card, modal, and drawer surfaces |
| `--bg-surface-subtle` | `#F0F3F8` | Table headers, secondary buttons, row hovers |
| `--border-color` | `#E3E8EF` | Standard 1px divider and container border |
| `--border-color-strong` | `#CBD5E1` | Input borders, secondary button borders |
| `--text-primary` | `#0F172A` | Primary headings, titles, tabular values |
| `--text-secondary` | `#475569` | Body copy, secondary descriptions |
| `--text-muted` | `#64748B` | Labels, timestamps, metadata |

### 2.5 Dark Theme Counterparts (`html[data-theme="dark"]`)
When switched to dark mode, tokens automatically remap:

| Token | Dark Value | Notes |
| :--- | :--- | :--- |
| `--bg-page` | `#0B1220` | Deep slate canvas |
| `--bg-surface` | `#111A2E` | Elevated dark surface |
| `--bg-surface-subtle` | `#16223B` | Table headers, muted elements |
| `--border-color` | `#24324D` | Subdued dark divider |
| `--border-color-strong` | `#334155` | Elevated input borders |
| `--text-primary` | `#E6ECF8` | High contrast white-blue text |
| `--text-secondary` | `#9FB0CF` | Muted body copy |
| `--text-muted` | `#7A8BAE` | Subtle labels |
| `--color-primary-600` | `#6C93F0` | Lightened interactive primary |

### 2.6 Status Semantics

| Status | Text Color | Background | Border | Canonical Meaning |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | `var(--color-success)` (`#148A5B`) | `var(--color-success-bg)` (`#E7F6EE`) | `var(--color-success-border)` | Ready to Bill, Approved, Connected |
| **Warning** | `var(--color-warning)` (`#B7791F`) | `var(--color-warning-bg)` (`#FEF3D7`) | `var(--color-warning-border)` | Awaiting Sign-off, Pending Review |
| **Danger** | `var(--color-danger)` (`#C0392B`) | `var(--color-danger-bg)` (`#FCE8E6`) | `var(--color-danger-border)` | At Risk (SLA/Margin), Blocked, Overdue |
| **Info** | `var(--color-info)` (`#2563A8`) | `var(--color-info-bg)` (`#E6F0FA`) | `var(--color-info-border)` | In Review, Processing, Scheduled |
| **Neutral** | `var(--color-neutral)` (`#64748B`) | `var(--color-neutral-bg)` (`#EEF1F6`) | `var(--color-neutral-border)` | Unearned, Draft, Dormant |

*(Dark theme automatically uses lightened, WCAG AA compliant equivalents: `#34D399`, `#FBBF24`, `#F87171`, `#60A5FA`).*

### 2.7 Chart Series Tokens
All SVG charts, sparklines, and trajectory visualizations reference:
- Series 1 (Primary Liquidity): `var(--chart-series-1)` (`#284FB8`)
- Series 2 (Realized Growth): `var(--chart-series-2)` (`#0F9D8A`)
- Series 3 (Pending Settlement): `var(--chart-series-3)` (`#E0A100`)
- Series 4 (Disputed / Risk): `var(--chart-series-4)` (`#C0392B`)
- Series 5 (Contract Holdback): `var(--chart-series-5)` (`#7C5CC4`)
- Series 6 (Benchmark / Neutral): `var(--chart-series-6)` (`#64748B`)

### 2.8 Typography Scale

| Role | Font Size | Weight | Line Height | Letter Spacing | CSS Variable |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Page Title** | 22px (`1.375rem`) | 600 | 1.25 | -0.01em | `--font-size-page-title` |
| **Card Title** | 16px (`1rem`) | 600 | 1.35 | 0 | `--font-size-card-title` |
| **KPI Value** | 28px (`1.75rem`) | 700 | 1.2 | -0.02em | `--font-size-kpi` |
| **Body Text** | 14px (`0.875rem`) | 400 | 1.5 | 0 | `--font-size-body` |
| **Section Label** | 12px (`0.75rem`) | 600 (Uppercase) | 1.2 | 0.04em | `--font-size-label` |
| **Small / Meta** | 12px (`0.75rem`) | 400 | 1.4 | 0 | `--font-size-xs` |

**Numerical Data Rule**: Always apply `font-variant-numeric: tabular-nums` to financial metrics, tables, and invoice timestamps to maintain consistent vertical column alignment.

### 2.9 Spacing, Radii & Shadows
- **Spacing Scale**: 4px (`--space-1`), 8px (`--space-2`), 12px (`--space-3`), 16px (`--space-4`), 20px (`--space-5`), 24px (`--space-6`), 32px (`--space-8`), 48px (`--space-12`).
- **Radii**: Strictly **8px** (`--border-radius-sm` / `--border-radius-md`) for controls and inputs; **12px** (`--border-radius-lg` / `--border-radius-xl`) for cards, modals, and dropdowns; full pill (`9999px`) for badges.
- **Shadows**:
  - Cards: `0 1px 2px rgba(15,23,42,0.04)` (`--shadow-card`). Interactive hover raises border to `--color-primary-300` without heavy drop shadows.
  - Modals, Popovers, Dropdowns: `0 8px 24px rgba(15,23,42,0.12)` (`--shadow-modal`).
- **Transitions**: 120ms to 160ms (`--transition-fast`) for hover and focus states only. Automatically disabled under `@media (prefers-reduced-motion: reduce)`.

---

## 3. Core Component Library

### 3.1 Buttons
- **Primary**: `.btn.btn-primary` (Solid `--color-primary-600`, hover `--color-primary-700`).
- **Secondary**: `.btn.btn-secondary` (White surface with `--border-color-strong`).
- **Outline**: `.btn.btn-outline` (Transparent with `--color-primary-600` border).
- **Ghost**: `.btn.btn-ghost` (Transparent with `--bg-surface-subtle` hover).
- **Danger**: `.btn.btn-danger` (Solid `--color-danger`).
- **Sizes**: Standard 36px height (`.btn`), Compact 30px (`.btn-sm`), Large 42px (`.btn-lg`), Icon only 36x36px (`.btn-icon-only`).
- **Accessibility**: Focused elements receive `outline: 2px solid var(--color-primary-300); outline-offset: 2px;`.

### 3.2 Cards
- Base class: `.card`
- Header: `.card-header` with `.card-title` and `.card-subtitle`
- Body: `.card-body`
- Footer: `.card-footer`
- Interactive cards: `.card.card-interactive:hover` (elevates border to `var(--color-primary-300)`).

### 3.3 KPI Metric Cards
- Container: `.kpi-grid` (responsive auto-fill grid, min 260px columns)
- Card: `.kpi-card` (20px padding, min-height 140px, flex layout)
- Elements:
  - `.kpi-header` containing `.kpi-label` (12px uppercase muted) and `.kpi-icon-wrap` (`.blue`, `.emerald`, `.amber`, `.rose`).
  - `.kpi-value` (28px bold tabular-nums).
  - `.kpi-footer` with `.kpi-trend` (`.positive`, `.negative`, `.neutral`).

### 3.4 Badges & Status Pills
- Pill shape: `border-radius: var(--border-radius-full);`
- Canonical Milestone Statuses:
  - `<span class="status-badge status-ready">Ready to Bill</span>`
  - `<span class="status-badge status-in-review">In Review</span>`
  - `<span class="status-badge status-awaiting-sign-off">Awaiting Sign-off</span>`
  - `<span class="status-badge status-at-risk">At Risk</span>`
  - `<span class="status-badge status-client-accepted">Client Accepted</span>`
  - `<span class="status-badge status-unearned">Unearned</span>`

### 3.5 Tables
- Wrapper: `.table-responsive`
- Table: `.table`
- Headers: Sticky `th` with subtle surface (`var(--bg-surface-subtle)`), 12px uppercase muted font.
- Rows: 48px height, 1px bottom border, hover background `var(--bg-surface-subtle)`.
- Numeric Columns: Apply `.table-col-numeric` or `.text-right` with `tabular-nums`.

### 3.6 Form Controls
- Height: 40px (`.form-control`)
- Border: 1px solid `var(--border-color-strong)`, radius 8px
- Focus: Border `var(--color-primary-500)` with 3px subtle focus shadow
- Validation States: `.is-invalid` (with `.form-error`) and `.is-valid`.

---

## 4. How to Build a Module That Matches the Theme

When developing a new feature module in `modules/<module-id>/`, follow this checklist to guarantee seamless theme inheritance:

### Step 1: Link Standard Design System Stylesheets
In your module's `index.html`:
```html
<!-- Bootstrap 5 CDN (for grid and utilities) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">

<!-- Finnova Design System Tokens & Components -->
<link rel="stylesheet" href="../../core/css/base.css">
<link rel="stylesheet" href="../../core/css/components.css">

<!-- Scoped Module Styles -->
<link rel="stylesheet" href="<module-id>.css">
```

### Step 2: Include Immediate Theme Synchronization
Add this small script in the `<head>` of your module HTML to prevent dark/light theme flashes when loaded in the shell iframe:
```html
<script>
  (function() {
    const theme = localStorage.getItem("finnova_theme") || "light";
    document.documentElement.setAttribute("data-theme", theme);
  })();
</script>
```

In your module's JavaScript (`<module-id>.js`), listen for theme changes sent by the parent shell:
```javascript
window.addEventListener("message", (e) => {
  if (e.data && e.data.type === "THEME_CHANGED") {
    document.documentElement.setAttribute("data-theme", e.data.theme);
  }
});
```

### Step 3: Use Standard Component Boilerplates

#### KPI Cards Grid
```html
<section class="kpi-grid">
  <div class="kpi-card">
    <div class="kpi-header">
      <span class="kpi-label">Active Milestone Pipeline</span>
      <div class="kpi-icon-wrap blue">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      </div>
    </div>
    <div class="kpi-value">₹ 1,45,00,000</div>
    <div class="kpi-footer">
      <span class="kpi-trend positive">↑ +14.2%</span>
      <span>vs last month</span>
    </div>
  </div>
</section>
```

#### Enterprise Data Table
```html
<section class="card">
  <div class="card-header">
    <h2 class="card-title">Governance Milestones</h2>
    <button type="button" class="btn btn-secondary btn-sm">Export</button>
  </div>
  <div class="table-responsive">
    <table class="table">
      <thead>
        <tr>
          <th>Ref</th>
          <th>Milestone</th>
          <th>Status</th>
          <th class="table-col-numeric">Value (INR)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>MS-101</code></td>
          <td>Architecture Sign-Off</td>
          <td><span class="status-badge status-ready"><span class="badge-dot"></span> Ready to Bill</span></td>
          <td class="table-col-numeric">₹ 45,00,000</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
```

### Step 4: Strict Developer Rules
1. **Never hardcode hex codes**: Always use `var(--color-...)` or `var(--bg-...)`.
2. **Indian Rupee Standard**: Display all currency in INR (`₹`) formatted according to Indian numbering (e.g., `₹ 1,25,00,000`).
3. **Use Tabular Numerals**: Add `font-variant-numeric: tabular-nums` or the `.table-col-numeric` class on all financial and time metrics.
4. **Interactive States**: Use `.btn:focus-visible` and `.card-interactive` for keyboard and mouse accessibility.
