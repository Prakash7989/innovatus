import React from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-full hover:bg-primary-100/10 dark:hover:bg-dark-100/50 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-6 h-6 text-primary-300" />
      ) : (
        <Moon className="w-6 h-6 text-primary-600" />
      )}
    </button>
  );
}