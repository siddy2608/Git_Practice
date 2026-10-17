# Finnova M-RAL - Module Developer Template

Use this template to create a new business module in isolation with **zero git merge conflicts**.

## Quick Start (How to Add a Module)

1. **Copy this template folder** to `modules/<module-id>/` (e.g., `modules/commercial/`):
   ```bash
   cp -r modules/_template modules/<module-id>
   ```
2. **Rename files**:
   - `module.js` -> `<module-id>.js` (e.g., `commercial.js`)
   - `module.css` -> `<module-id>.css` (e.g., `commercial.css`)
3. **Update `<link>` and `<script>` in `index.html`**:
   - Change `module.css` to `<module-id>.css`.
   - Change `module.js` to `<module-id>.js`.
4. **Edit `module.config.js`**:
   - Set `id: "<module-id>"`.
   - Set `title`, `shortTitle`, `category`, `order`, `icon`, `description`.
   - When ready to preview in the shell, set:
     - `path: "modules/<module-id>/index.html"`
     - `status: "ready"`
     - `badgeText: "Ready"`
     - `badgeClass: "badge-ready"`

**That is all!** You do NOT need to touch `index.html`, `navigation.js`, or any file in `core/`.

## Developer Guidelines
- **INR Formatting Only**: All financial figures must use Indian Rupees (`₹`, Lakhs, Crores).
- **Theme Inheritance**: Use CSS tokens like `var(--bg-surface)`, `var(--text-primary)`, `var(--border-color)`.
- **Parent Notifications**: Call `window.parent.FinnovaApp.toast(title, message, type)` to show shell toast alerts.
