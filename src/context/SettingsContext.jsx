import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  accent: 'crimson',
  setAccent: () => {},
});

/** Trial accent overrides (crimson = theme default, no overrides).
 *  Kept inline + minimal so the whole experiment lifts out cleanly. */
export const ACCENTS = {
  crimson: null,
  amber: {
    '--color-accent': 'oklch(0.72 0.16 80)',
    '--color-accent-deep': 'oklch(0.57 0.15 80)',
    '--color-accent-soft': 'oklch(0.28 0.06 80)',
    swatch: '#e0a63c',
  },
  emerald: {
    '--color-accent': 'oklch(0.70 0.16 165)',
    '--color-accent-deep': 'oklch(0.55 0.14 165)',
    '--color-accent-soft': 'oklch(0.25 0.05 165)',
    swatch: '#34cf8e',
  },
  indigo: {
    '--color-accent': 'oklch(0.68 0.17 285)',
    '--color-accent-deep': 'oklch(0.54 0.15 285)',
    '--color-accent-soft': 'oklch(0.26 0.06 285)',
    swatch: '#7d8df7',
  },
};

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('an-theme') || 'dark';
    } catch {
      return 'dark';
    }
  });
  const [accent, setAccentState] = useState(() => {
    try {
      return localStorage.getItem('an-accent') || 'crimson';
    } catch {
      return 'crimson';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    root.style.colorScheme = theme;
    try {
      localStorage.setItem('an-theme', theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const vars = ACCENTS[accent] || null;
    ['--color-accent', '--color-accent-deep', '--color-accent-soft'].forEach(
      (v) => root.style.removeProperty(v)
    );
    if (vars) {
      root.style.setProperty('--color-accent', vars['--color-accent']);
      root.style.setProperty('--color-accent-deep', vars['--color-accent-deep']);
      root.style.setProperty('--color-accent-soft', vars['--color-accent-soft']);
    }
    try {
      localStorage.setItem('an-accent', accent);
    } catch {
      /* storage unavailable */
    }
  }, [accent]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const setAccent = (name) => {
    if (Object.prototype.hasOwnProperty.call(ACCENTS, name)) setAccentState(name);
  };

  return (
    <SettingsContext.Provider value={{ theme, toggleTheme, accent, setAccent }}>
      {children}
    </SettingsContext.Provider>
  );
}
