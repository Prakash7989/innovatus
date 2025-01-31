import React from 'react';
import { ThemeToggle } from './ThemeToggle.jsx';
import { Settings } from 'lucide-react';

export function Navbar({ theme, toggleTheme }) {
  return (
    <header className="sticky top-0 z-30 bg-white/70 dark:bg-dark-100/50 backdrop-blur-sm 
      border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-end gap-2">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <button className="p-2 rounded-full hover:bg-primary-100/10 dark:hover:bg-dark-100/50 transition-colors">
            <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
