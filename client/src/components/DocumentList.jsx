import React, { useState, useEffect } from "react";
import { FileText, Calendar } from "lucide-react";
import axios from "axios";
import { DocumentModal } from "./DocumentModal";

export function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/files");
        const sortedDocuments = response.data.sort(
          (a, b) => new Date(b.upload_date) - new Date(a.upload_date)
        );
  
        // Mapping file names to their categories
        const fileCategoryMap = new Map();
  
        sortedDocuments.forEach(doc => {
          if (!fileCategoryMap.has(doc.name)) {
            fileCategoryMap.set(doc.name, doc.categories);
          } else {
            doc.categories = fileCategoryMap.get(doc.name);
          }
        });
  
        setDocuments(sortedDocuments);
        setFilteredDocuments(sortedDocuments);
  
        // Extract unique categories
        const uniqueCategories = new Set(["All"]);
        sortedDocuments.forEach(doc => {
          doc.categories.forEach(cat => uniqueCategories.add(cat.category));
        });
  
        setCategories(Array.from(uniqueCategories));
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDocuments();
  }, []);
  

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      filterByCategory(selectedCategory);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = documents.filter((doc) => {
      const nameMatch = doc.name.toLowerCase().includes(searchLower);
      const typeMatch = doc.type.toLowerCase().includes(searchLower);
      const categoryMatch = doc.categories.some((cat) =>
        cat.category.toLowerCase().includes(searchLower)
      );
      
      return (selectedCategory === "All" || doc.categories.some(cat => cat.category === selectedCategory)) 
        && (nameMatch || typeMatch || categoryMatch);
    });
    
    setFilteredDocuments(filtered);
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents.filter(doc =>
        doc.categories.some(cat => cat.category === category)
      );
      setFilteredDocuments(filtered);
    }
  };

  const handleDocumentClick = async (doc) => {
    setSelectedDocument({ ...doc, summary: null });
    setIsLoadingSummary(true);

    try {
      const response = await axios.get(`http://localhost:5000/get-summary/${doc.id}`);
      setSelectedDocument((prevDoc) => ({
        ...prevDoc,
        summary: response.data.summary,
      }));
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSelectedDocument((prevDoc) => ({
        ...prevDoc,
        summary: "Failed to load summary.",
      }));
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleString();
  };

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-white/70 dark:bg-dark-100/50 p-6 rounded-xl shadow-lg">
        <input
          type="text"
          placeholder="Search documents..."
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
            bg-white dark:bg-dark-200 focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Categories Section */}
      <div className="bg-white/70 dark:bg-dark-100/50 p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Categories</h2>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => filterByCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-primary-500 text-white dark:bg-primary-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="bg-white/70 dark:bg-dark-100/50 p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Documents</h2>
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading documents...</p>
          ) : filteredDocuments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No documents found.</p>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                onClick={() => handleDocumentClick(doc)}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 
                  hover:bg-gray-50 dark:hover:bg-dark-200/50 cursor-pointer transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex-shrink-0">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 dark:text-primary-300" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{doc.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(doc.upload_date)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {doc.categories.map((category, index) => (
                    <div
                      key={index}
                      className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-full bg-primary-100 
                        dark:bg-primary-900/30 text-primary-600 dark:text-primary-300"
                    >
                      {category.category}
                    </div>
                  ))}
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