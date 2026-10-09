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
    '--color-accent': 'oklch(0.70 0.14 78)',
    '--color-accent-deep': 'oklch(0.55 0.13 78)',
    '--color-accent-soft': 'oklch(0.27 0.05 78)',
    swatch: '#dda63e',
  },
  teal: {
    '--color-accent': 'oklch(0.68 0.13 195)',
    '--color-accent-deep': 'oklch(0.53 0.12 195)',
    '--color-accent-soft': 'oklch(0.24 0.05 195)',
    swatch: '#3fb8a8',
  },
  plum: {
    '--color-accent': 'oklch(0.66 0.15 330)',
    '--color-accent-deep': 'oklch(0.52 0.13 330)',
    '--color-accent-soft': 'oklch(0.25 0.05 330)',
    swatch: '#c97bb8',
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
