# Finnova M-RAL - Technical Architecture & Developer Guide

## 1. System Overview

Finnova Milestone Readiness, Acceptance & Liquidity (M-RAL) is an enterprise financial operations platform built with standard vanilla web technologies (HTML5, Vanilla CSS3, ES6+ JavaScript) and **no build step or bundler**.

To support a distributed team of developers building 14 distinct business modules simultaneously without git merge conflicts, Finnova uses a **Decentralized Self-Registering Module Architecture**.

---

## 2. Target Directory Structure

```text
finnova/
├── index.html                     # Master Dashboard Layout & Iframe Host
├── auth/
│   ├── login.html                 # Enterprise Split-Card Sign-In
│   └── register.html              # Demo Registration & Password Strength Checker
├── client/
│   ├── index.html                 # Client Acceptance & Sign-Off Portal
│   └── README.md                  # Client Portal Documentation
├── core/
│   ├── css/
│   │   ├── base.css               # Design tokens, color system, typography, resets
│   │   ├── components.css         # Reusable cards, buttons, badges, tables, modals
│   │   ├── layout.css             # Persistent sidebar, header, loader, dropdowns
│   │   ├── auth.css               # Authentication layouts, quick-fill pills
│   │   └── responsive.css         # Breakpoints, mobile drawer overlay
│   └── js/
│       ├── data/
│       │   ├── storage.js         # Browser localStorage/sessionStorage manager
│       │   └── shell-data.js      # System-wide demo accounts & header notifications ONLY
│       ├── services/
│       │   ├── validation.js      # Form validation & password complexity checks
│       │   ├── permissions.js     # RBAC roles matrix & badge helpers
│       │   └── auth.js            # Page-independent authentication & route guard
│       └── shell/
│           ├── navigation.js      # Self-registration navigation engine & router
│           └── app.js             # Master shell UI, spotlight search (Ctrl+K), toasts
├── modules/
│   ├── _registry.js               # Central array of 14 module IDs (filled once, never edited)
│   ├── _template/                 # Canonical template folder with 5 starter files
│   ├── overview/                  # Executive Liquidity Pulse (fully developed)
│   │   ├── index.html
│   │   ├── module.config.js
│   │   ├── overview.js
│   │   ├── overview.css
│   │   └── data.js
│   ├── placeholder/               # Fallback engine for modules still under construction
│   │   └── index.html
│   └── <module-id>/               # Dedicated folder for each of the 14 modules
│       ├── index.html             # Module markup
│       ├── module.config.js       # Calls FinnovaNavigation.register(...)
│       ├── <module-id>.js         # Module interactive controller
│       ├── <module-id>.css        # Module scoped styling
│       └── data.js                # Module mock and pipeline dataset
├── docs/
│   ├── ARCHITECTURE.md            # System architecture and module design
│   ├── CONTRIBUTING.md            # Git branch, commit, and code conventions
│   └── milestone-readiness-ui.zip # Archived distribution bundle
└── .gitignore                     # OS, IDE, and temporary files filter
```

---

## 3. The Decentralized Self-Registering Architecture

### The Merge Conflict Problem in Shared Monoliths
In conventional static applications, adding or modifying a module requires editing a central `MODULE_REGISTRY` array in `navigation.js` and adding script/stylesheet tags to `index.html`. When 10+ developers work concurrently on feature branches, this leads to repeated git merge conflicts on shared files.

### The Finnova Solution
1. **Zero Changes to Core**:
   - `index.html` loads only `modules/_registry.js`.
   - `modules/_registry.js` contains the static array of all 14 module IDs and dynamically injects `modules/<id>/module.config.js` for each module sequentially before shell navigation initializes.
   - `_registry.js` is pre-configured once and is **never** edited during regular feature development.

2. **Self-Registration Hook**:
   Inside `modules/<module-id>/module.config.js`, the module registers itself directly:
   ```javascript
   FinnovaNavigation.register({
     id: "commercial",
     title: "Commercial Management",
     shortTitle: "Commercial",
     category: "Project Operations",
     order: 10,
     path: "modules/commercial/index.html",
     status: "ready",
     badgeText: "Ready",
     badgeClass: "badge-ready",
     description: "Client contracts, SOWs, and billing terms.",
     icon: `<svg>...</svg>`
   });
   ```

3. **Deterministic Category Ordering**:
   `navigation.js` defines the strict platform category sequence:
   1. `Executive Suite`
   2. `Governance`
   3. `Project Operations`
   4. `Financial Engine`
   5. `Treasury & Capital`

   Modules are automatically sorted by category order, and within each category by their numeric `order` (configured in steps of 10).

4. **Asynchronous Shell Navigation Init**:
   During page load, `FinnovaApp.init()` awaits `FinnovaNavigation.init()`, which awaits `FinnovaModuleRegistry.loadAll()`. The navigation sidebar and hash router render only once all module configs are in place, guaranteeing predictable, identical rendering on every load.

---

## 4. How to Add or Build a Module (Developer Flow)

To build a module (e.g. `commercial`):

1. **Work Exclusively Inside Your Folder**:
   Each module folder already contains its 5 standard files:
   - `modules/<module-id>/index.html`
   - `modules/<module-id>/module.config.js`
   - `modules/<module-id>/<module-id>.js`
   - `modules/<module-id>/<module-id>.css`
   - `modules/<module-id>/data.js`

2. **Activate the Module**:
   In `modules/<module-id>/module.config.js`, change:
   ```javascript
   path: "modules/<module-id>/index.html",
   status: "ready",
   badgeText: "Ready",
   badgeClass: "badge-ready"
   ```

3. **Develop Your Features**:
   - Build UI components in `index.html`.
   - Style your components in `<module-id>.css`.
   - Place realistic Indian enterprise mock data in `data.js`.
   - Handle user events and calculations in `<module-id>.js`.

**Done!** No edits to `index.html`, `core/js/shell/navigation.js`, or any other shared file.

---

## 5. Script Load Order & Dependency Hierarchy

Scripts in `index.html` load in a strictly layered hierarchy:

1. **Data Layer** (`core/js/data/`):
   - `shell-data.js`: Demo users and shell alerts.
   - `storage.js`: Local and session storage APIs with factory reset.
2. **Services Layer** (`core/js/services/`):
   - `validation.js`: Input checks and password strength.
   - `permissions.js`: Role access control and permissions matrix.
   - `auth.js`: Page-independent session checks and route guards.
3. **Module Registry Layer** (`modules/`):
   - `_registry.js`: Dynamically loads all `modules/<id>/module.config.js` files sequentially.
4. **Shell Layer** (`core/js/shell/`):
   - `navigation.js`: Stores configs, sorts modules, and handles iframe routing.
   - `app.js`: Master layout orchestrator, header dropdowns, spotlight search, modals.

---

## 6. Page-Independent Authentication URL Resolution

To prevent broken redirects when pages move between root and subdirectories (`auth/login.html`), `core/js/services/auth.js` dynamically computes the base root URL relative to its own script tag:

```javascript
const ROOT_URL = new URL("../../../", document.currentScript.src).href;
const LOGIN_URL = ROOT_URL + "auth/login.html";
const HOME_URL = ROOT_URL + "index.html";
```

All route protection guards (`requireAdminSession`), login redirects, and logout actions utilize `LOGIN_URL` and `HOME_URL`, ensuring zero 404s from any location.
