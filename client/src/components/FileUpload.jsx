import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import axios from 'axios';

export function FileUpload({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);  // Ensure it's an array

  const handleFileUpload = (newFile) => {
    if (!newFile) return;
    
    // Ensure `files` is always an array
    setFiles((prevFiles) => Array.isArray(prevFiles) ? [...prevFiles, newFile] : [newFile]);
  };
  
  const uploadFile = async (selectedFile) => {
    if (!selectedFile) return;
  
    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    console.log("Uploading file:", selectedFile);
  
    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Upload successful:", response.data);
      onFileUpload(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };
  
  

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("You can upload only one file at a time.");
      return;
    }
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      uploadFile(selectedFile); // Automatically upload on drop
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    }
  });

  const handleFileChange = (e) => {
    if (e.target.files.length > 1) {
      alert("You can upload only one file at a time.");
      return;
    }

    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (
        selectedFile.type === "application/pdf" ||
        selectedFile.name.endsWith(".ppt") ||
        selectedFile.name.endsWith(".pptx") ||
        selectedFile.name.endsWith(".doc") ||
        selectedFile.name.endsWith(".docx")
      )
    ) {
      setFile(selectedFile);
      uploadFile(selectedFile); // Automatically upload on selection
    } else {
      alert("Please select a valid file (PDF, PPT, PPTX, DOC, DOCX).");
    }
  };

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
            ? "Drop the file here..."
            : "Drag 'n' drop a file here, or click to select one"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Supports PDF, DOCX, and PPT files (One file at a time)
        </p>
        {uploading && <p className="text-blue-500">Uploading...</p>}
      </div>
      <input 
        type="file" 
        onChange={handleFileChange} 
        accept=".ppt,.pptx,.pdf,.doc,.docx"
        className="hidden"
      />
    </div>
  );
}