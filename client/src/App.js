import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { DocumentList } from './components/DocumentList';
import { SearchBar } from './components/SearchBar';
import { ThemeToggle } from './components/ThemeToggle';
import { DocumentModal } from './components/DocumentModal';
import { Sidebar } from './components/SideBar';
import { NewsApp } from './components/NewsApp';
import { Settings } from 'lucide-react';
// import type { Document, Theme, AppRoute } from './types';

function App() {
  // const [documents, setDocuments] = useState<Document[]>([]);
  const [documents, setDocuments] = useState([]);
  // const [theme, setTheme] = useState<Theme>('light');
  const [theme, setTheme] = useState('light');
  // const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  // const [currentRoute, setCurrentRoute] = useState<AppRoute>('documents');
  const [currentRoute, setCurrentRoute] = useState('documents');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // const handleFileUpload = async (files: File[]) => {
  const handleFileUpload = async (files) => {
    // const processedDocs: Document[] = files.map(file => ({
    const processedDocs = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      category: 'Uncategorized',
      tags: ['New', file.type.split('/')[1]],
      uploadDate: new Date(),
      summary: `This is an AI-generated summary of ${file.name}. The document appears to be a ${file.type.split('/')[1]} file containing important information. The main topics covered include project management, data analysis, and strategic planning. The document emphasizes the importance of clear communication and efficient workflow processes.`,
      highlights: [
        'Key findings suggest a 25% improvement in efficiency',
        'Implementation strategy outlined in section 3.2',
        'Recommendations for future developments',
        'Cost analysis and resource allocation details'
      ]
    }));

    setDocuments(prev => [...processedDocs, ...prev]);
  };

  const handleSearch = (query) => {
    console.log('Searching for:', query);
  };

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
  };

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
      />

      <div className={`transition-all duration-300 ${isSidebarOpen && !isMobile ? 'ml-64' : 'ml-0'}`}>
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
          {currentRoute === 'documents' ? (
            <div className="grid gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Document Manager
                </h2>
                <FileUpload onFileUpload={handleFileUpload} />
              </div>

              <div className="space-y-4">
                <SearchBar onSearch={handleSearch} />
                
                <div className="p-6 rounded-xl backdrop-blur-sm bg-white/70 dark:bg-dark-100/50 
                  border border-gray-200 dark:border-gray-800 shadow-lg">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Your Documents
                  </h2>
                  {documents.length > 0 ? (
                    <DocumentList
                      documents={documents}
                      onDocumentClick={handleDocumentClick}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">
                        No documents uploaded yet. Start by uploading some files!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <NewsApp />
          )}
        </main>
      </div>

      {selectedDocument && (
        <DocumentModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}

export default App;