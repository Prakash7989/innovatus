import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

// interface FileUploadProps {
//   onFileUpload: (files: File[]) => void;
// }

export function FileUpload({ onFileUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    onFileUpload(acceptedFiles);
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-2 border-dashed rounded-xl backdrop-blur-sm
        transition-all duration-300 ease-in-out
        ${isDragActive 
          ? 'border-primary-400 bg-primary-400/10 dark:border-primary-300 dark:bg-primary-300/5' 
          : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-300'
        }
        dark:bg-dark-100/30`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <Upload className={`w-12 h-12 ${
          isDragActive ? 'text-primary-500 dark:text-primary-300' : 'text-gray-400 dark:text-gray-500'
        }`} />
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {isDragActive
            ? "Drop the files here..."
            : "Drag 'n' drop files here, or click to select files"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Supports PDF, DOCX, and PPT files
        </p>
      </div>
    </div>
  );
}