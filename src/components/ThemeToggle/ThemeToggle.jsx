import { Sun, Moon } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useSettings();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-elevated text-muted transition-colors duration-200 hover:border-linestrong hover:text-text"
    >
      <span className="relative block h-5 w-5" aria-hidden="true">
        <Sun
          className={`theme-icon absolute inset-0 h-5 w-5 ${
            isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <Moon
          className={`theme-icon absolute inset-0 h-5 w-5 ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </span>
    </button>
  );
}
