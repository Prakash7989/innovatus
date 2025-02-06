import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileUpload } from '../components/FileUpload';
import { DocumentList } from '../components/DocumentList.jsx';
import { SearchBar } from '../components/SearchBar.jsx';
import { DocumentModal } from '../components/DocumentModal.jsx';

export function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Fetch documents on mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/files");
        // Sort documents by upload_date in descending order
        const sortedDocuments = response.data.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
        setDocuments(sortedDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, []); // Run only once when component mounts

  // Handle file upload
  const handleFileUpload = async (uploadedFile) => {
    if (!uploadedFile) return;

    try {
      // Fetch the updated list of documents after upload
      const response = await axios.get("http://localhost:5000/files");
      // Sort documents by upload_date in descending order
      const sortedDocuments = response.data.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
      setDocuments(sortedDocuments);
    } catch (error) {
      console.error("Error fetching updated documents:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 max-w mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
        Upload and Manage Documents
      </h2>

      <FileUpload onFileUpload={handleFileUpload} />
      <SearchBar />

      <div className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Your Documents
        </h3>

        {documents.length > 0 ? (
          <DocumentList
            documents={documents}
            onDocumentClick={setSelectedDocument}
          />
        ) : (
          <p className="text-gray-500 text-center text-xs">No documents found.</p>
        )}
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