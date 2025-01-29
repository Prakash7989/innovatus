import React from 'react';
import { FileText, Newspaper, Bookmark, ChevronLeft, LogOut, User } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';


export function Sidebar({ currentRoute, onRouteChange, isMobile, isOpen, onToggle, user }) {
  const menuItems = [
    {
      route: 'documents',
      icon: FileText,
      label: 'Documents',
    },
    {
      route: 'news',
      icon: Newspaper,
      label: 'News',
    },
    {
      route: 'saved',
      icon: Bookmark,
      label: 'Saved Articles',
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-16'} bg-white/80 dark:bg-dark-100/80 backdrop-blur-md 
         `}
      onClick={() => !isOpen && onToggle()}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4">
          {isOpen && (
            <>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-500 
                dark:from-primary-300 dark:to-primary-400 bg-clip-text text-transparent">
                InovateUs
              </h1>
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-200/50"
              >
                <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </>
          )}
        </div>

        <nav className="flex-1 px-3 py-4">
          {menuItems.map(({ route, icon: Icon, label }) => (
            <button
              key={route}
              onClick={() => onRouteChange(route)}
              className={`w-full flex items-center gap-4 px-3 py-3 mb-2 rounded-xl 
                transition-all duration-200 group
                ${currentRoute === route 
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300' 
                  : 'hover:bg-gray-100 dark:hover:bg-dark-200/50 text-gray-600 dark:text-gray-400'
                }`}
            >
              <Icon className={`w-6 h-6 transition-transform duration-200 
                ${currentRoute === route ? 'scale-110' : 'group-hover:scale-110'}`} />
              {isOpen && (
                <span className="font-medium whitespace-nowrap">{label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          {user && (
            <div className="mb-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-200/50">
              <div className="flex items-center gap-3">
                <div className=" rounded-lg bg-primary-50 dark:bg-primary-900/30 
                  flex-shrink-0">
                  <User className="w-5 h-5 text-primary-500 dark:text-primary-300" />
                </div>
                {isOpen && (
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl 
              text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 
              transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}