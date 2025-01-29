import React from 'react';
import { FileText, Tag, Calendar } from 'lucide-react';


export function DocumentList({ documents, onDocumentClick }) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onDocumentClick(doc)}
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
                <p className="text-sm text-gray-500 dark:text-gray-400">{doc.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{doc.uploadDate.toLocaleDateString()}</span>
            </div>
          </div>
          
          {doc.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {doc.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full 
                    bg-primary-50 dark:bg-primary-900/30 text-xs text-primary-700 
                    dark:text-primary-300 border border-primary-100 dark:border-primary-800"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}