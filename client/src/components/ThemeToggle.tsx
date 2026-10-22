import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className={`theme-toggle-icon-wrap ${isDark ? 'is-dark' : 'is-light'}`}>
        <Sun className="theme-icon sun-icon" size={18} strokeWidth={2.2} />
        <Moon className="theme-icon moon-icon" size={18} strokeWidth={2.2} />
      </div>
    </button>
  );
};
