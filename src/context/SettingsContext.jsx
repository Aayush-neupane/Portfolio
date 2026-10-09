import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  accent: 'crimson',
  setAccent: () => {},
});

/** Trial accent overrides (crimson = theme default, no overrides).
 *  Each accent carries dark + light values so it stays legible on both the
 *  ink background and the paper background. Kept inline + minimal so the
 *  whole experiment lifts out cleanly. */
export const ACCENTS = {
  crimson: null,
  pink: {
    dark: {
      '--color-accent': 'oklch(0.72 0.15 8)',
      '--color-accent-deep': 'oklch(0.60 0.14 8)',
      '--color-accent-soft': 'oklch(0.27 0.05 8)',
    },
    light: {
      '--color-accent': 'oklch(0.55 0.16 8)',
      '--color-accent-deep': 'oklch(0.46 0.15 8)',
      '--color-accent-soft': 'rgba(206, 84, 124, 0.16)',
    },
    swatch: '#f2a3c0',
  },
  gold: {
    dark: {
      '--color-accent': 'oklch(0.76 0.12 85)',
      '--color-accent-deep': 'oklch(0.62 0.11 85)',
      '--color-accent-soft': 'oklch(0.28 0.05 85)',
    },
    light: {
      '--color-accent': 'oklch(0.55 0.12 85)',
      '--color-accent-deep': 'oklch(0.46 0.11 85)',
      '--color-accent-soft': 'rgba(158, 128, 68, 0.20)',
    },
    swatch: '#c8a96b',
  },
  yellow: {
    dark: {
      '--color-accent': 'oklch(0.82 0.16 95)',
      '--color-accent-deep': 'oklch(0.68 0.15 95)',
      '--color-accent-soft': 'oklch(0.30 0.06 95)',
    },
    light: {
      '--color-accent': 'oklch(0.60 0.15 95)',
      '--color-accent-deep': 'oklch(0.50 0.14 95)',
      '--color-accent-soft': 'rgba(168, 138, 20, 0.20)',
    },
    swatch: '#facc15',
  },
  teal: {
    dark: {
      '--color-accent': 'oklch(0.74 0.16 190)',
      '--color-accent-deep': 'oklch(0.58 0.14 190)',
      '--color-accent-soft': 'oklch(0.26 0.06 190)',
    },
    light: {
      '--color-accent': 'oklch(0.52 0.13 190)',
      '--color-accent-deep': 'oklch(0.44 0.12 190)',
      '--color-accent-soft': 'rgba(44, 148, 133, 0.16)',
    },
    swatch: '#3fd2b6',
  },
};

// First-dial names, renamed for a warmer set — migrate stored picks.
const ACCENT_ALIASES = { emerald: 'teal', indigo: 'plum', plum: 'pink' };

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
    const def = ACCENTS[accent] || null;
    const vars = def ? def[theme === 'light' ? 'light' : 'dark'] : null;
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
  }, [accent, theme]);

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
