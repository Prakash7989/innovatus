import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { DocumentList } from '../components/DocumentList.jsx';
import { SearchBar } from '../components/SearchBar.jsx';
import { DocumentModal } from '../components/DocumentModal.jsx';

const CATEGORIES = [
  { id: '1', name: 'Business', color: 'blue' },
  { id: '2', name: 'Technology', color: 'purple' },
  { id: '3', name: 'Education', color: 'green' },
  { id: '4', name: 'Research', color: 'orange' },
  { id: '5', name: 'Marketing', color: 'pink' },
  { id: '6', name: 'Finance', color: 'indigo' },
];

const categorizeDocument = (fileName) => {
  const content = fileName.toLowerCase();
  if (content.includes('business') || content.includes('market')) return CATEGORIES[0];
  if (content.includes('tech') || content.includes('code')) return CATEGORIES[1];
  if (content.includes('study') || content.includes('course')) return CATEGORIES[2];
  if (content.includes('research') || content.includes('analysis')) return CATEGORIES[3];
  if (content.includes('marketing') || content.includes('brand')) return CATEGORIES[4];
  if (content.includes('finance') || content.includes('budget')) return CATEGORIES[5];
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
};

export function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleFileUpload = async (files) => {
    const processedDocs = files.map(file => {
      const category = categorizeDocument(file.name);
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        category: category.name,
        categoryColor: category.color,
        tags: ['New', category.name],
        uploadDate: new Date(),
        summary: `Categorized as ${category.name}.`,
        highlights: ['Key findings', 'Important metrics', 'Strategic recommendations']
      };
    });
    setDocuments(prev => [...processedDocs, ...prev]);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-4 p-4 max-w mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
        Smart Docs
      </h2>
      <FileUpload onFileUpload={handleFileUpload} />
      <SearchBar onSearch={setSearchQuery} />
      
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button onClick={() => setSelectedCategory('all')} className={`px-3 py-1 rounded-full text-sm ${selectedCategory === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-200'}`}>
          All
        </button>
        {CATEGORIES.map(category => (
          <button key={category.id} onClick={() => setSelectedCategory(category.name)} className={`px-3 py-1 rounded-full text-sm ${selectedCategory === category.name ? `bg-${category.color}-500 text-white` : 'bg-gray-200'}`}>
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Your Documents</h3>
        {filteredDocuments.length > 0 ? (
          <DocumentList documents={filteredDocuments} onDocumentClick={setSelectedDocument} />
        ) : (
          <p className="text-gray-500 text-center text-xs">No documents found.</p>
        )}
      </div>

      {selectedDocument && <DocumentModal document={selectedDocument} onClose={() => setSelectedDocument(null)} />}
    </div>
  );
}
