import React from 'react';
import { FileText, Newspaper, Menu, ChevronRight } from 'lucide-react';
// import type { AppRoute } from '../types';

// interface SidebarProps {
//   currentRoute: AppRoute;
//   onRouteChange: (route: AppRoute) => void;
//   isMobile: boolean;
//   isOpen: boolean;
//   onToggle: () => void;
// }

// export function Sidebar({ currentRoute, onRouteChange, isMobile, isOpen, onToggle }: SidebarProps) {
export function Sidebar({ currentRoute, onRouteChange, isMobile, isOpen, onToggle }) {
  const menuItems = [
    {
      route: 'documents',
    //   route: 'documents' as AppRoute,
      icon: FileText,
      label: 'Documents',
    },
    {
      route: 'news',
    //   route: 'news' as AppRoute,
      icon: Newspaper,
      label: 'News',
    },
  ];

  return (
    <>
      {isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-dark-100/80 
            backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      )}

      <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 
        ${isOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full bg-white/80 dark:bg-dark-100/80 backdrop-blur-md border-r 
          border-gray-200 dark:border-gray-700 shadow-xl">
          <div className="flex items-center justify-between p-4 border-b 
            border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-500 
              dark:from-primary-300 dark:to-primary-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            {isMobile && (
              <button onClick={onToggle} className="p-1 rounded-lg hover:bg-gray-100 
                dark:hover:bg-dark-200/50">
                <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map(({ route, icon: Icon, label }) => (
              <button
                key={route}
                onClick={() => {
                  onRouteChange(route);
                  if (isMobile) onToggle();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                  transition-all duration-200 group
                  ${currentRoute === route 
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-dark-200/50 text-gray-600 dark:text-gray-400'
                  }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 
                  ${currentRoute === route ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}