import React, { useRef, useState, useEffect } from "react";
import { X, Play, Pause } from "lucide-react";
import axios from "axios";

export function DocumentModal({ document, isLoadingSummary, onClose }) {
  const [currentDoc, setCurrentDoc] = useState(document);
  const [isPlaying, setIsPlaying] = useState(false);
  const speechRef = useRef(null);

  const handleClose = () => {
    window.speechSynthesis.cancel();
    onClose();
  };

  const handleSpeech = () => {
    if (!currentDoc.summary) return;

    if (!speechRef.current) {
      speechRef.current = new SpeechSynthesisUtterance(currentDoc.summary);
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
    } else {
      window.speechSynthesis.speak(speechRef.current);
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const checkStatus = async () => {
      if (currentDoc.status === 'pending') {
        try {
          const response = await axios.get(
            `http://localhost:5000/get-summary/${currentDoc.id}`
          );
          
          if (response.status === 200) {
            setCurrentDoc({
              ...currentDoc,
              status: 'processed',
              summary: response.data.summary,
              categories: response.data.categories
            });
          }
        } catch (error) {
          console.error("Status check failed:", error);
        }
      }
    };
    const interval = setInterval(checkStatus, 2000);
    return () => {
      clearInterval(interval);
      window.speechSynthesis.cancel();
    };
  }, [currentDoc]);

  useEffect(() => {
    if (currentDoc.summary) {
      speechRef.current = new SpeechSynthesisUtterance(currentDoc.summary);
    }
  }, [currentDoc.summary]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm -mt-12"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl 
        bg-white/90 dark:bg-dark-100/90 backdrop-blur-md shadow-2xl 
        border border-gray-200/50 dark:border-gray-700/50 
        animate-in fade-in duration-200">
        
        {/* Header Section */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b 
          border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">

            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                {currentDoc.name}
              </h3>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200/50 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Categories Chips */}
        <div className="p-4 sm:p-6 flex flex-wrap gap-2">
          {currentDoc.status === 'processed' ? (
            currentDoc.categories?.map((cat, index) => (
              <span 
                key={index} 
                className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full"
              >
                {cat.category}
              </span>
            ))
          ) : (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-24 animate-pulse"
              />
            ))
          )}
        </div>

        {/* Summary Section */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Summary</h4>

          {currentDoc.status !== 'processed' ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full animate-pulse"
                  style={{ width: `${i === 2 ? '90%' : i === 4 ? '70%' : '100%'}` }}
                />
              ))}
            </div>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {currentDoc.summary}
              </p>
              <button 
                onClick={handleSpeech} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-primary-600 dark:text-primary-300" />
                ) : (
                  <Play className="w-4 h-4 text-primary-600 dark:text-primary-300" />
                )}
                <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
                  {isPlaying ? "Pause" : "Listen"}
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}