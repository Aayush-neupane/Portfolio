import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  saver: false,
  toggleSaver: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('an-theme') || 'dark';
    } catch {
      return 'dark';
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

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const [saver, setSaver] = useState(() => {
    try {
      return localStorage.getItem('an-saver') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('saver', saver);
    try {
      localStorage.setItem('an-saver', saver ? '1' : '0');
    } catch {
      /* storage unavailable */
    }
  }, [saver]);

  const toggleSaver = () => setSaver((s) => !s);

  return (
    <SettingsContext.Provider value={{ theme, toggleTheme, saver, toggleSaver }}>
      {children}
    </SettingsContext.Provider>
  );
}
