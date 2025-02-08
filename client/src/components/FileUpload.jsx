import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

export function FileUpload({ onFileUpload, theme }) {
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 10;
  const showToast = (message, type = 'success') => {
    toast[type](message, {
      position: "bottom-right",
      autoClose: 3000,
      className: theme === 'dark' ? 'toast-dark' : 'toast-light',
      progressClassName: theme === 'dark' 
        ? 'Toastify__progress-bar--dark' 
        : 'Toastify__progress-bar--light'
    });
  };

  const uploadFile = async (selectedFile) => {
    setUploadingCount(prev => prev + 1);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      onFileUpload({
        file_id: response.data.file_id,
        filename: selectedFile.name,
        file_type: selectedFile.type
      });
      showToast(`${selectedFile.name} uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      showToast(`Failed to upload ${selectedFile.name}`, 'error');
    } finally {
      setUploadingCount(prev => prev - 1);
    }
  };

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.flatMap(file => file.errors);
      let errorMessage = '';
      
      if (errors.some(e => e.code === 'too-many-files')) {
        errorMessage += `Maximum ${MAX_FILES} files can be uploaded at once. `;
      }
      if (errors.some(e => e.code === 'file-too-large')) {
        errorMessage += `Each file must be smaller than ${MAX_FILE_SIZE/1024/1024}MB. `;
      }
      if (errors.some(e => e.code === 'file-invalid-type')) {
        errorMessage += 'Only PDF, DOC, DOCX, PPT, PPTX files are allowed. ';
      }
      
      alert(errorMessage.trim());
      return;
    }

    acceptedFiles.forEach(file => {
      uploadFile(file);
    });
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, MAX_FILES);
    
    if (e.target.files.length > MAX_FILES) {
      alert(`Maximum ${MAX_FILES} files can be uploaded at once.`);
      return;
    }

    const validFiles = selectedFiles.filter(file => 
      file.size <= MAX_FILE_SIZE && (
        file.type === "application/pdf" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".ppt")
      )
    );

    if (validFiles.length !== selectedFiles.length) {
      alert('Some files are invalid. Please ensure each file is a PDF, DOC, DOCX, PPT, PPTX and under 5MB.');
      return;
    }

    validFiles.forEach(file => uploadFile(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
    multiple: true
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
          {isDragActive
            ? "Drop the files here..."
            : "Drag 'n' drop files here, or click to select"}
        </p>
        <p className={`text-sm ${isDragActive || isHover ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
          Supports PDF, DOC, DOCX, PPT, PPTX files (Max {MAX_FILES} files, {MAX_FILE_SIZE/1024/1024}MB each)
        </p>
        {uploadingCount > 0 && (
          <p className="text-blue-500">
            Uploading {uploadingCount} file{uploadingCount > 1 ? 's' : ''}...
          </p>
        )}
      </div>
      <input 
        type="file" 
        onChange={handleFileChange} 
        accept=".ppt,.pptx,.pdf,.doc,.docx"
        className="hidden"
        multiple
      />
    </div>
  );
}