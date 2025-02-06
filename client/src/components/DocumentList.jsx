import React, { useState, useEffect } from "react";
import { FileText, Calendar } from "lucide-react";
import axios from "axios";
import { DocumentModal } from "./DocumentModal";

export function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/files");
        // Sort documents by upload_date in descending order
        const sortedDocuments = response.data.sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
      setDocuments(sortedDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleDocumentClick = async (doc) => {
    // Open modal immediately with a loading state
    setSelectedDocument({ ...doc, summary: null });
    setIsLoadingSummary(true);

    try {
      console.log("Fetching summary for:", doc.id);
      const response = await axios.get(`http://localhost:5000/get-summary/${doc.id}`);
      setSelectedDocument((prevDoc) => ({
        ...prevDoc,
        summary: response.data.summary,
      }));
    } catch (error) {
      console.error("Error fetching summary:", error.response?.data || error.message);
      setSelectedDocument((prevDoc) => ({
        ...prevDoc,
        summary: "Failed to load summary.",
      }));
    } finally {
      setIsLoadingSummary(false);
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
  <span>
  {new Date(doc.upload_date).toLocaleString()}
</span>
</div>
            </div>

            {/* Categories as chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {doc.categories.map((category, index) => (
                <div
                  key={index}
                  className="px-3 py-1 text-sm rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300"
                >
                  {category.category}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Modal for document details */}
      {selectedDocument && (
        <DocumentModal
          document={selectedDocument}
          isLoadingSummary={isLoadingSummary}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}