import React, { useRef, useState } from 'react';
import { X, Play, Pause, Volume2 } from 'lucide-react';


export function DocumentModal({ document, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleSpeech = () => {
    if (!speechRef.current) {
      speechRef.current = new SpeechSynthesisUtterance(document.summary || '');
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
        
        <div className="flex items-center justify-between p-4 sm:p-6 border-b 
          border-gray-200/50 dark:border-gray-800/50">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="p-2 rounded-lg bg-primary-50/50 dark:bg-primary-900/30 flex-shrink-0">
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500 dark:text-primary-300" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                {document.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {document.category}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200/50 
              transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(90vh-5rem)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Summary
              </h4>
              <button
                onClick={handleSpeech}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg 
                  bg-primary-50 dark:bg-primary-900/30 
                  hover:bg-primary-100 dark:hover:bg-primary-900/50 
                  text-primary-600 dark:text-primary-300
                  transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {isPlaying ? 'Pause' : 'Listen'}
                </span>
              </button>
            </div>
            
            <div className="p-4 rounded-xl bg-gray-50/50 dark:bg-dark-200/50 
              border border-gray-100 dark:border-gray-800/50 
              max-h-[200px] sm:max-h-[300px] overflow-y-auto
              scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700
              scrollbar-track-transparent">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {document.summary}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              Key Highlights
            </h4>
            <div className="grid gap-3">
              {document.highlights?.map((highlight, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-lg bg-gray-50/50 dark:bg-dark-200/50 
                    border border-gray-100 dark:border-gray-800/50"
                >
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}