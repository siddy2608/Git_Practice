/**
 * Finnova M-RAL Prototype - Storage Manager
 * Sprint 1 Base UI Foundation
 * 
 * Handles browser localStorage and sessionStorage operations with safe fallbacks.
 * PROTOTYPE NOTICE: Used strictly for client-side prototype demonstration.
 * Browser storage is not secure and does not provide production-grade authentication.
 */

(function () {
  const STORAGE_KEYS = {
    USERS: "finnova_demo_users",
    SESSION: "finnova_active_session",
    REMEMBERED_EMAIL: "finnova_remembered_email",
    SETTINGS: "finnova_user_settings",
    INITIALIZED: "finnova_proto_initialized"
  };

  const Storage = {
    keys: STORAGE_KEYS,

    /**
     * Safe JSON fetch from localStorage
     */
    get(key, defaultValue = null) {
      try {
        const raw = localStorage.getItem(key);
        if (raw === null) return defaultValue;
        return JSON.parse(raw);
      } catch (e) {
        console.warn(`[Storage.get] Error reading "${key}":`, e);
        return defaultValue;
      }
    },

    /**
     * Safe JSON write to localStorage
     */
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error(`[Storage.set] Error writing "${key}":`, e);
        return false;
      }
    },

    /**
     * Remove item from localStorage
     */
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error(`[Storage.remove] Error removing "${key}":`, e);
        return false;
      }
    },

    /**
     * Safe session storage get
     */
    getSession(key, defaultValue = null) {
      try {
        const raw = sessionStorage.getItem(key);
        if (raw === null) return defaultValue;
        return JSON.parse(raw);
      } catch (e) {
        console.warn(`[Storage.getSession] Error reading "${key}":`, e);
        return defaultValue;
      }
    },

    /**
     * Safe session storage write
     */
    setSession(key, value) {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error(`[Storage.setSession] Error writing "${key}":`, e);
        return false;
      }
    },

    /**
     * Remove item from sessionStorage
     */
    removeSession(key) {
      try {
        sessionStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error(`[Storage.removeSession] Error removing "${key}":`, e);
        return false;
      }
    },

    /**
     * Seed initial demo data into localStorage if not already present
     */
    seedInitialData() {
      try {
        const existingUsers = this.get(STORAGE_KEYS.USERS);
        if (!existingUsers || !Array.isArray(existingUsers) || existingUsers.length === 0) {
          const shellData = window.FINNOVA_SHELL_DATA || window.FINNOVA_MOCK_DATA;
          const defaultUsers = (shellData && shellData.users) || [];
          this.set(STORAGE_KEYS.USERS, defaultUsers);
          this.set(STORAGE_KEYS.INITIALIZED, new Date().toISOString());
          console.info("[Finnova Storage] Demo users seeded successfully.");
        }
      } catch (e) {
        console.error("[Finnova Storage] Seeding error:", e);
      }
    },

    /**
     * Reset prototype data back to original defaults
     */
    resetPrototypeData() {
      try {
        const shellData = window.FINNOVA_SHELL_DATA || window.FINNOVA_MOCK_DATA;
        const defaultUsers = (shellData && shellData.users) || [];
        this.set(STORAGE_KEYS.USERS, defaultUsers);
        this.removeSession(STORAGE_KEYS.SESSION);
        this.remove(STORAGE_KEYS.SESSION);
        this.set(STORAGE_KEYS.INITIALIZED, new Date().toISOString());
        console.info("[Finnova Storage] Prototype data reset to factory state.");
        return true;
      } catch (e) {
        console.error("[Finnova Storage] Reset error:", e);
        return false;
      }
    }
  };

  // Seed on script load
  Storage.seedInitialData();

  // Export to window
  window.FinnovaStorage = Storage;
})();
