import React, { useState, useEffect } from "react";
import { FileText, Trash2 } from "lucide-react";
import axios from "axios";
import { DocumentModal } from "./DocumentModal";

import { toast } from 'react-toastify';

export function DocumentList(theme) {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all documents and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await axios.get("http://localhost:5000/files", {
        });
        const sortedDocuments = response.data.sort(
          (a, b) => new Date(b.upload_date) - new Date(a.upload_date)
        );
        
        setDocuments(sortedDocuments);
        
        // Extract unique categories
        const uniqueCategories = new Set(["All"]);
        response.data.forEach(doc => {
          doc.categories.forEach(cat => uniqueCategories.add(cat.category));
        });
        setCategories(Array.from(uniqueCategories));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(fetchData, 3000);
    fetchData();
    return () => clearInterval(interval);
  }, []);

  // Apply filters whenever documents, search term, or category changes
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...documents];

      // Category filter
      if (selectedCategory !== "All") {
        filtered = filtered.filter(doc => 
          doc.categories.some(cat => cat.category === selectedCategory)
        );
      }

      // Search term filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(doc => {
          const nameMatch = doc.name.toLowerCase().includes(term);
          const typeMatch = doc.type.toLowerCase().includes(term);
          const categoryMatch = doc.categories.some(cat => 
            cat.category.toLowerCase().includes(term)
          );
          return nameMatch || typeMatch || categoryMatch;
        });
      }

      setFilteredDocuments(filtered);
    };

    applyFilters();
  }, [documents, searchTerm, selectedCategory]);

  const handleSearch = (newTerm) => {
    setSearchTerm(newTerm);
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
  };
  const handleDocumentClick = async (doc) => {
    setSelectedDocument(doc);
    setIsLoadingSummary(true);

    const pollSummary = async (documentId, attempts = 0) => {
      try {
        const response = await axios.get(`http://localhost:5000/get-summary/${documentId}`);
        
        if (response.status === 200) {
          setSelectedDocument(prev => ({
            ...prev,
            summary: response.data.summary,
            categories: response.data.categories,
            status: 'processed'
          }));
          setIsLoadingSummary(false);
        } else if (response.status === 202 && attempts < 10) {
          setTimeout(() => pollSummary(documentId, attempts + 1), 2000);
        } else {
          setIsLoadingSummary(false);
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
        setIsLoadingSummary(false);
      }
    };

    pollSummary(doc.id);
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:5000/delete-file/${fileId}`);
      toast.error("File deleted successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: theme === "dark" ? "toast-dark" : "toast-light",
        progressClassName: theme === "dark" 
          ? "Toastify__progress-bar--dark" 
          : "Toastify__progress-bar--light"
      });
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl  px-4">
      {/* Search Section */}
      <div className="bg-white/80 dark:bg-dark-100/60 p-6 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/30 dark:border-gray-800/50">
        <div className="relative">
          <div className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200/80 dark:border-gray-700/60 
              bg-white/50 dark:bg-dark-200/40 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500
              backdrop-blur-sm transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white/80 dark:bg-dark-100/60 p-6 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/30 dark:border-gray-800/50">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Categories</h2>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => filterByCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${
                    selectedCategory === category
                      ? "bg-primary-500/90 text-white shadow-md shadow-primary-500/20 dark:bg-primary-600/90"
                      : "bg-gray-100/60 text-gray-600 hover:bg-gray-200/50 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-700/60"
                  } backdrop-blur-sm border ${
                    selectedCategory === category 
                      ? "border-primary-400/30 dark:border-primary-600/30" 
                      : "border-gray-200/50 dark:border-gray-700/50"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white/80 dark:bg-dark-100/60 p-6 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/30 dark:border-gray-800/50">
        <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">Documents</h2>
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton (improved)
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/30 dark:bg-dark-200/30 backdrop-blur-sm">
                  <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200/50 dark:bg-gray-700/50 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded w-3/4" />
                      <div className="h-3 bg-gray-200/50 dark:bg-gray-700/50 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-200/50 dark:bg-gray-700/50 rounded-full w-20" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500/90 dark:text-gray-400/80">No documents found matching your criteria</p>
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleDocumentClick(doc)}
                className="group p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 
                  hover:bg-white/50 dark:hover:bg-dark-200/40 cursor-pointer transition-all duration-300
                  backdrop-blur-sm hover:shadow-sm hover:-translate-y-0.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2.5 rounded-xl bg-primary-500/10 dark:bg-primary-900/20 flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary-500/90 dark:text-primary-400/80" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900/90 dark:text-gray-100/90 truncate">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-500/80 dark:text-gray-400/80 truncate">{doc.type}</p>
                    </div>
                  </div>
               
  <div 
    className="absolute bottom-4 right-4  p-2 bg-red-500/80 text-white rounded-full cursor-pointer shadow-lg hover:bg-red-600 transition-all"
    onClick={(e) => {
      e.stopPropagation();
      handleDelete(doc.id);
    }}
  >
    <Trash2 className="w-6 h-6" />
  </div>


                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {doc.status === 'processed' ? (
                    doc.categories.map((category, index) => (
                      <div
                        key={index}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-primary-500/10 dark:bg-primary-900/20 
                          text-primary-600/90 dark:text-primary-400/80 border border-primary-500/20 dark:border-primary-600/30"
                      >
                        {category.category}
                      </div>
                    ))
                  ) : (
                    [...Array(2)].map((_, i) => (
                      <div
                        key={i}
                        className="h-6 bg-gray-200/50 dark:bg-gray-700/50 rounded-full w-20 animate-pulse"
                      />
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

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