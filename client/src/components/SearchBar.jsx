import React from 'react';
import { Search } from 'lucide-react';

// interface SearchBarProps {
//   onSearch: (query: string) => void;
// }

export function SearchBar({ onSearch }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      <input
        type="text"
        placeholder="Search documents, tags, or content..."
        className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-dark-100/50 border border-gray-200 
          dark:border-gray-700 rounded-xl backdrop-blur-sm focus:ring-2 focus:ring-primary-400 
          dark:focus:ring-primary-300 focus:border-transparent dark:text-white placeholder-gray-400 
          dark:placeholder-gray-500 transition-colors"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}