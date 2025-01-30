import React, { useState, useEffect } from 'react';
import { DocumentsPage } from './pages/DocumentsPage.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { Settings } from 'lucide-react';
import { auth } from './lib/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { NewsPage } from './pages/NewsPage.jsx';

function App() {
  const [theme, setTheme] = useState('light');
  const [currentRoute, setCurrentRoute] = useState('documents');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setShowAuthModal(true);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setSidebarOpen(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (!user) {
    return <AuthModal isOpen={showAuthModal} onClose={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 
      dark:from-dark-200 dark:to-dark-300 transition-colors duration-300">
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe')] 
        bg-cover bg-center opacity-10 dark:opacity-5 pointer-events-none" />
      
      <Sidebar
        currentRoute={currentRoute}
        onRouteChange={setCurrentRoute}
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
        user={user}
      />

      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <header className="sticky top-0 z-30 bg-white/70 dark:bg-dark-100/50 backdrop-blur-sm 
          border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-end gap-2">
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
              <button className="p-2 rounded-full hover:bg-primary-100/10 dark:hover:bg-dark-100/50 
                transition-colors">
                <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentRoute === 'documents' ? <DocumentsPage /> : <NewsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;