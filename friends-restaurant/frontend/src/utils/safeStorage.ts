/**
 * Safe localStorage wrapper that will never throw SecurityError or DOMException
 * in strict in-app browsers, private modes, or camera QR webviews.
 */
export const safeStorage = {
  getItem: (key: string, defaultValue: string | null = null): string | null => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return defaultValue;
      const val = window.localStorage.getItem(key);
      return val !== null ? val : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Silently ignore quota / security restrictions
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Silently ignore errors
    }
  },
};
