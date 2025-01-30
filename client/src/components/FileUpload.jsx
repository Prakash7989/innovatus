import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

export function FileUpload({ onFileUpload }) {
  const [isHover, setIsHover] = useState(false);

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
        transition-all duration-300 ease-in-out cursor-pointer
        ${isDragActive || isHover
          ? 'border-blue-500 bg-blue-100 bg-opacity-40 dark:border-blue-400 dark:bg-blue-300/10' 
          : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400'
        }
        dark:bg-dark-100/30`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <Upload className={`w-12 h-12 ${
          isDragActive || isHover ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
        }`} />
        <p className={`text-lg ${isDragActive || isHover ? 'text-blue-500 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'}`}>
          {isDragActive ? "Drop the files here..." : "Drag 'n' drop files here, or click to select files"}
        </p>
        <p className={`text-sm ${isDragActive || isHover ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          Supports PDF, DOCX, and PPT files
        </p>
      </div>
    </div>
  );
}
