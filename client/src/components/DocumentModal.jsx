import React, { useRef, useState } from "react";
import { X } from "lucide-react";
export function DocumentModal({ document, isLoadingSummary, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const speechRef = useRef(null);

  const handleSpeech = () => {
    if (!speechRef.current) {
      speechRef.current = new SpeechSynthesisUtterance(document.summary || "");
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
    } else {
      window.speechSynthesis.speak(speechRef.current);
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl 
        bg-white/90 dark:bg-dark-100/90 backdrop-blur-md shadow-2xl 
        border border-gray-200/50 dark:border-gray-700/50 
        animate-in fade-in duration-200">
        
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b 
          border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="p-2 rounded-lg bg-primary-50/50 dark:bg-primary-900/30 flex-shrink-0">
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                {document.name}
              </h3>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200/50 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Categories Chips */}
        <div className="p-4 sm:p-6 flex flex-wrap gap-2">
          {document.categories?.map((cat, index) => (
            <span 
              key={index} 
              className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full"
            >
              {cat.category}
            </span>
          ))}
        </div>

        {/* Summary Section */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Summary</h4>

          {isLoadingSummary ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded-md w-full animate-pulse"></div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {document.summary}
            </p>
          )}

          {/* Original Text Section */}
          {/* <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Original Text</h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {document.originaltext}
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}