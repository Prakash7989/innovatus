import React, { useState, useEffect } from "react";
import { FileText, Calendar } from "lucide-react";
import axios from "axios";

export function DocumentList({ onDocumentClick }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDocId, setLoadingDocId] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/files");
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDocuments(); 
  
    const interval = setInterval(fetchDocuments, 5000); 
  
    return () => clearInterval(interval); 
  }, []);
  

  const handleDocumentClick = async (doc) => {
    if (!doc || !doc.id) {
      console.error("Error: Document ID is missing");
      return;
    }

    setLoadingDocId(doc.id);

    try {
      const response = await axios.get(`http://localhost:5000/get-summary/${doc.id}`);
      const summary = response.data.summary;
      onDocumentClick({ ...doc, summary });
    } catch (error) {
      console.error("Error fetching summary:", error);
      onDocumentClick({ ...doc, summary: "Failed to load summary." });
    } finally {
      setLoadingDocId(null);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No documents found.</p>
      ) : (
        documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => handleDocumentClick(doc)}
            className="p-4 sm:p-6 rounded-xl backdrop-blur-sm bg-white/70 dark:bg-dark-100/50 
              border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-100/20 
              dark:shadow-dark-300/30 hover:shadow-xl hover:shadow-primary-100/20 
              dark:hover:shadow-primary-900/30 transition-all duration-300 cursor-pointer
              hover:bg-white/90 dark:hover:bg-dark-100/70"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 dark:text-primary-300" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{doc.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{doc.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {loadingDocId === doc.id && (
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Fetching summary...
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
