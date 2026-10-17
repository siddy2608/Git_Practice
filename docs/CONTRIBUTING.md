# Finnova M-RAL - Developer Contributing Guide

Welcome to the Finnova Milestone Readiness, Acceptance & Liquidity (M-RAL) platform. This guide outlines how multiple developers collaborate in parallel with near-zero git merge conflicts using our modular static architecture.

---

## 1. Folder Ownership Rule

- **Strict Isolation**: Work **only** inside your designated module folder: `modules/<module-id>/`.
- **Zero Core Edits**: Never modify files in `core/`, `auth/`, `client/`, `index.html`, or `modules/_registry.js` as part of regular feature development.
- **Self-Contained Module Structure**: Each module is fully self-contained with exactly 5 files:
  - `modules/<module-id>/index.html` (View markup)
  - `modules/<module-id>/module.config.js` (Sidebar & routing registration)
  - `modules/<module-id>/<module-id>.js` (Controller & event logic)
  - `modules/<module-id>/<module-id>.css` (Scoped module styling)
  - `modules/<module-id>/data.js` (Mock & demo dataset)

---

## 2. Git Branching & Commits

- **Branch Naming**: Always create your branch from `master` using the convention:
  ```bash
  git checkout -b feature/<module-id>
  ```
  *Example*: `git checkout -b feature/commercial`

- **Commit Message Format**: Format every commit with your module ID prefix:
  ```
  <module-id>: <imperative description>
  ```
  *Example*: `commercial: implement contract milestone table and digital sign-off`

- **Core Changes Rule**: If a shared design system enhancement or core service fix is genuinely required, do **not** mix it into your feature branch. It must be submitted as a separate, minimal commit or branch reviewed and approved by the Framework Lead.

---

## 3. How to Run Locally

Because Finnova M-RAL uses vanilla HTML/CSS/JS without build steps or bundlers, run any standard static HTTP server from the root directory:

```bash
# Using Python 3:
python -m http.server 8000

# Using Node (npx serve):
npx serve .

# Or using VS Code Live Server extension:
# Open project root and click "Go Live"
```

Then open `http://localhost:8000` in your browser.
Default Demo Credentials:
- **Email**: `admin@finnova.io`
- **Password**: `Admin@1234`

---

## 4. Shell Integration & Data Sharing

Modules run inside an `<iframe>` within the master application shell. You can interact with the parent shell via standard browser APIs:

- **Toast Notifications**:
  ```javascript
  if (window.parent && window.parent.FinnovaApp) {
    window.parent.FinnovaApp.toast("Title", "Your notification message", "success");
    // Types: "success" | "warning" | "danger" | "info"
  }
  ```

- **Navigation & Inspection**:
  ```javascript
  if (window.parent && window.parent.FinnovaNavigation) {
    window.parent.FinnovaNavigation.navigateTo("overview");
  }
  ```

- **Theme Synchronization**:
  Modules automatically inherit the active theme. Listen for real-time theme updates:
  ```javascript
  window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "THEME_CHANGED") {
      document.documentElement.setAttribute("data-theme", event.data.theme);
    }
  });
  ```

---

## 5. Pre-Merge Checklist

Before merging your branch into `master`, verify the following:
- [ ] **Tested in Iframe**: Verified functionality inside the master shell (`index.html`) as well as standalone.
- [ ] **Dual-Theme Tested**: All elements render clearly with proper contrast in both **Light** and **Dark** themes.
- [ ] **INR Currency Only**: All financial amounts strictly use Indian currency notation (`₹`, Lakhs `₹L`, Crores `₹Cr`).
- [ ] **Zero Core Diffs**: `git diff master -- core/ index.html modules/_registry.js` yields no changes.
- [ ] **Console Clean**: No 404s, CORS errors, or unhandled exceptions in the developer tools console.
