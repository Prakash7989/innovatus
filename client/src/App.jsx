import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DocumentsPage } from "./pages/DocumentsPage.jsx";
import { NewsPage } from "./pages/NewsPage.jsx";
import { SavedArticlesPage } from "./pages/SavedArticlesPage.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { AuthModal } from "./components/AuthModal.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { auth } from "./lib/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [theme, setTheme] = useState("light");
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
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  if (!user) {
    return <AuthModal isOpen={showAuthModal} onClose={() => {}} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 dark:from-dark-200 dark:to-dark-300 transition-colors duration-300">
        <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe')] bg-cover bg-center opacity-10 dark:opacity-5 pointer-events-none" />
        <ToastContainer
          toastClassName={(context) => 
            theme === 'dark' 
              ? "bg-gray-800 text-white rounded-lg shadow-lg" 
              : "bg-white text-gray-800 rounded-lg shadow-lg"
          }
          progressClassName={(context) =>
            theme === 'dark'
              ? "Toastify__progress-bar--dark"
              : "Toastify__progress-bar--light"
          }
        />
        <Sidebar
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
          user={user}
        />
        <div
          className={`transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-16"
          }`}
        >
          <Navbar theme={theme} toggleTheme={toggleTheme} />
          <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<DocumentsPage theme={theme} />} />
              <Route path="/news" element={<NewsPage theme={theme} />} />
              <Route path="/saved-articles" element={<SavedArticlesPage theme={theme} />}/>
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
