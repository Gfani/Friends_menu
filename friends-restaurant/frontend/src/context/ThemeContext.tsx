import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'dark' | 'light';

export interface ThemeContextType {
  theme: Theme;
  isLightMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('friends_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // Ignore localStorage read errors
    }
    return 'dark'; // Default brand theme
  });

  const isLightMode = theme === 'light';

  useEffect(() => {
    const root = document.documentElement;
    if (isLightMode) {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.style.backgroundColor = '#FFFFFF';
      document.body.style.color = '#111827';
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      document.body.style.backgroundColor = '#050505';
      document.body.style.color = '#FFFFFF';
    }

    try {
      localStorage.setItem('friends_theme', theme);
    } catch {
      // Ignore localStorage write errors
    }

    // Update meta theme-color for mobile address bars
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isLightMode ? '#FFFFFF' : '#050505');
    }
  }, [theme, isLightMode]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isLightMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
