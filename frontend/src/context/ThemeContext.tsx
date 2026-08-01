import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

const LIGHT_VARS: Record<string, string> = {
  '--lux-cream': '250 250 247',
  '--lux-ivory': '246 243 238',
  '--lux-white': '255 255 255',
  '--lux-warm': '240 235 227',
  '--lux-charcoal': '28 28 28',
  '--lux-ink': '28 28 28',
  '--lux-on-ink': '255 255 255',
  '--lux-steel': '107 107 107',
  '--lux-gold': '184 151 106',
  '--lux-gold-light': '205 184 146',
  '--lux-gold-dark': '154 123 79',
  '--lux-border': '232 228 220',
  '--lux-green': '79 122 78',
  '--lux-red': '184 92 92',
  '--lux-black': '18 18 18',
  '--lux-dark': '34 34 34',
  '--lux-champagne': '28 28 28',
  '--shadow-soft': '0 2px 16px -4px rgba(28, 28, 28, 0.06)',
  '--shadow-card': '0 4px 24px rgba(28, 28, 28, 0.04)',
  '--shadow-card-hover': '0 16px 40px rgba(28, 28, 28, 0.08)',
  '--shadow-elegant': '0 8px 32px rgba(184, 151, 106, 0.1)',
  '--shadow-nav': '0 1px 2px rgba(28, 28, 28, 0.04)',
};

const DARK_VARS: Record<string, string> = {
  '--lux-cream': '15 15 15',
  '--lux-ivory': '22 22 22',
  '--lux-white': '30 30 30',
  '--lux-warm': '26 24 20',
  '--lux-charcoal': '240 237 232',
  '--lux-ink': '28 28 28',
  '--lux-on-ink': '255 255 255',
  '--lux-steel': '160 158 152',
  '--lux-gold': '205 184 146',
  '--lux-gold-light': '220 204 172',
  '--lux-gold-dark': '184 151 106',
  '--lux-border': '48 46 42',
  '--lux-green': '110 158 108',
  '--lux-red': '210 120 120',
  '--lux-black': '10 10 10',
  '--lux-dark': '38 38 38',
  '--lux-champagne': '240 237 232',
  '--shadow-soft': '0 2px 16px -4px rgba(0, 0, 0, 0.45)',
  '--shadow-card': '0 4px 24px rgba(0, 0, 0, 0.35)',
  '--shadow-card-hover': '0 16px 40px rgba(0, 0, 0, 0.5)',
  '--shadow-elegant': '0 8px 32px rgba(205, 184, 146, 0.12)',
  '--shadow-nav': '0 1px 2px rgba(0, 0, 0, 0.35)',
};

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getPreferredTheme(): Theme {
  return 'light';
}

export function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  const vars = theme === 'dark' ? DARK_VARS : LIGHT_VARS;

  root.classList.toggle('dark', theme === 'dark');
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;

  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }

  // Ensure body paints immediately even if child utilities lag
  document.body.style.backgroundColor = `rgb(${vars['--lux-cream']})`;
  document.body.style.color = `rgb(${vars['--lux-charcoal']})`;
}

function withThemeTransition(apply: () => void) {
  const root = document.documentElement;
  root.classList.add('theme-transition');
  apply();
  window.setTimeout(() => root.classList.remove('theme-transition'), 300);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const initial = getPreferredTheme();
    if (typeof window !== 'undefined') {
      applyThemeToDocument(initial);
    }
    return initial;
  });

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    withThemeTransition(() => {
      localStorage.setItem(STORAGE_KEY, next);
      applyThemeToDocument(next);
      setThemeState(next);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    withThemeTransition(() => {
      setThemeState((prev) => {
        const next: Theme = prev === 'dark' ? 'light' : 'dark';
        localStorage.setItem(STORAGE_KEY, next);
        applyThemeToDocument(next);
        return next;
      });
    });
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
