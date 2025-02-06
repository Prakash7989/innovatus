import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Newspaper, Bookmark, LogOut, User, X } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar({ isMobile, isOpen, onToggle, user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  const menuItems = [
    { route: '/', icon: FileText, label: 'Documents' },
    { route: '/news', icon: Newspaper, label: 'News' },
    { route: '/saved-articles', icon: Bookmark, label: 'Saved Articles' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-16'} bg-white/80 dark:bg-dark-100/80 backdrop-blur-md`}
      >
        <div className="flex flex-col h-full" onClick={() => !isMobile && onToggle()}> 
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4">
            {isOpen && (
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-500 
                dark:from-primary-300 dark:to-primary-400 bg-clip-text text-transparent">
                InovateUs
              </h1>
            )}
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 px-3 py-4">
            {menuItems.map(({ route, icon: Icon, label }) => (
              <Link
                key={route}
                to={route}
                className={`w-full flex items-center gap-4 px-3 py-3 mb-2 rounded-xl 
                  transition-all duration-200 group
                  ${location.pathname === route 
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-dark-200/50 text-gray-600 dark:text-gray-400'
                  }`}
              >
                <Icon className={`w-6 h-6 transition-transform duration-200 
                  ${location.pathname === route ? 'scale-110' : 'group-hover:scale-110'}`} />
                {isOpen && <span className="font-medium whitespace-nowrap">{label}</span>}
              </Link>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            {user && (
              <div className="mb-3 p-3 rounded-xl bg-gray-50 dark:bg-dark-200/50">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary-50 dark:bg-primary-900/30 flex-shrink-0">
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

            {/* Logout Button */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl 
                text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 
                transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.8, opacity: 0 }} 
              className="bg-white dark:bg-dark-100 p-6 rounded-lg shadow-lg w-96 text-center"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Logout</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Are you sure you want to log out?</p>
              <div className="mt-4 flex justify-center gap-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300"
                >Cancel</button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >Logout</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
