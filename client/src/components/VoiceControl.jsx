import React, { useState, useEffect } from 'react';
import { Mic, X } from 'lucide-react';

// interface VoiceControlProps {
//   onClose: () => void;
// }

export function VoiceControl({ onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    let recognition = null;

    if ('webkitSpeechRecognition' in window) {
      recognition = new (window ).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');

        setTranscript(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, []);

  return (
    <div className="relative p-6 rounded-xl bg-white/70 dark:bg-dark-100/50 
      backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full 
          hover:bg-gray-100 dark:hover:bg-dark-200/50 transition-colors"
      >
        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      </button>

      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-full ${
          isListening ? 'bg-primary-500 animate-pulse' : 'bg-gray-100 dark:bg-dark-200'
        }`}>
          <Mic className={`w-6 h-6 ${
            isListening ? 'text-white' : 'text-gray-500 dark:text-gray-400'
          }`} />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Voice Control
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isListening ? 'Listening...' : 'Voice recognition stopped'}
          </p>
        </div>
      </div>

      {transcript && (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-200/50">
          <p className="text-gray-700 dark:text-gray-300">{transcript}</p>
        </div>
      )}
    </div>
  );
}