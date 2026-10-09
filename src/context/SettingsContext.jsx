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
    '--color-accent': 'oklch(0.75 0.17 75)',
    '--color-accent-deep': 'oklch(0.58 0.15 75)',
    '--color-accent-soft': 'oklch(0.29 0.06 75)',
    swatch: '#f0b43c',
  },
  teal: {
    '--color-accent': 'oklch(0.74 0.16 190)',
    '--color-accent-deep': 'oklch(0.58 0.14 190)',
    '--color-accent-soft': 'oklch(0.26 0.06 190)',
    swatch: '#3fd2b6',
  },
  plum: {
    '--color-accent': 'oklch(0.70 0.19 340)',
    '--color-accent-deep': 'oklch(0.56 0.16 340)',
    '--color-accent-soft': 'oklch(0.27 0.06 340)',
    swatch: '#e57ab8',
  },
};

// First-dial names, renamed for a warmer set — migrate stored picks.
const ACCENT_ALIASES = { emerald: 'teal', indigo: 'plum' };

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
      const raw = localStorage.getItem('an-accent') || 'crimson';
      const v = ACCENT_ALIASES[raw] || raw;
      return v in ACCENTS ? v : 'crimson';
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
