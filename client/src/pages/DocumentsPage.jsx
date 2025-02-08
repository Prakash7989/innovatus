import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileUpload } from '../components/FileUpload';
import { DocumentList } from '../components/DocumentList.jsx';
// import { SearchBar } from '../components/SearchBar.jsx';
import { DocumentModal } from '../components/DocumentModal.jsx';

export function DocumentsPage( theme ) {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(2000);
  const [eventSource, setEventSource] = useState(null);

 // Fetch documents with polling
 useEffect(() => {
  const fetchDocuments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/files");
      const sortedDocuments = response.data.sort((a, b) => 
        new Date(b.upload_date) - new Date(a.upload_date)
      );
      setDocuments(sortedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  fetchDocuments();
  const interval = setInterval(fetchDocuments, pollingInterval);
  return () => clearInterval(interval);
}, [pollingInterval]);

 // Optimistically add new document
 const handleFileUpload = (uploadResponse) => {
  setDocuments(prev => [{
    id: uploadResponse.file_id,
    name: uploadResponse.filename,
    type: uploadResponse.file_type,
    status: "pending",
    upload_date: new Date().toISOString(),
    categories: []
  }, ...prev]);
};

useEffect(() => {
  const es = new EventSource('http://localhost:5000/sse');
  setEventSource(es);

  es.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.type === 'status_update') {
      setDocuments(prev => prev.map(doc => 
        doc.id === data.file_id ? { ...doc, status: data.status } : doc
      ));
      
      if (selectedDocument?.id === data.file_id) {
        setSelectedDocument(prev => ({ ...prev, status: data.status }));
      }
    }
  };

  return () => {
    es.close();
    setEventSource(null);
  };
}, []);

useEffect(() => {
  const fetchSummaryIfNeeded = async () => {
    if (selectedDocument?.status === 'processed' && !selectedDocument.summary) {
      try {
        const response = await axios.get(
          `http://localhost:5000/get-summary/${selectedDocument.id}`
        );
        setSelectedDocument(prev => ({
          ...prev,
          summary: response.data.summary,
          categories: response.data.categories
        }));
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    }
  };

  fetchSummaryIfNeeded();
}, [selectedDocument?.status]);

return (
  <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto min-h-screen">
    <div className="text-center space-y-1">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white/95 bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
        Document Management
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
        Securely manage and process your documents
      </p>
    </div>

    <FileUpload onFileUpload={handleFileUpload} />

    {/* <div className="p-6 rounded-2xl bg-white/30 dark:bg-gray-800/50 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 shadow-2xl shadow-gray-200/30 dark:shadow-gray-900/20"> */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white/90">
          Document Library
        </h3>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-700/30 px-2 py-1 rounded-lg">
          {documents.length} items
        </span>
      </div>

      {documents.length > 0 ? (
        <DocumentList
          documents={documents}
          onDocumentClick={setSelectedDocument}
        />
      ) : (
        <div className="p-8 text-center rounded-xl bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-800/30 dark:to-gray-800/10">
          <p className="text-gray-500/90 dark:text-gray-400 text-sm">
            Upload your first document to get started
          </p>
        </div>
      )}
    </div>

  // </div>
);
}