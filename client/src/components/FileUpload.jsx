import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';


export function FileUpload({ onFileUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 1) {
      alert("You can upload only one file at a time.");
      return;
    }
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]); // Store only the first file
      onFileUpload(acceptedFiles); // Pass files to parent if needed
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1, // Restrict to one file
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
    } else {
      alert("Please select a valid file (PDF, PPT, PPTX, DOC, DOCX).");
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please choose a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("File uploaded successfully.");
      console.log("Upload Response:", response.data);
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("File upload failed.");
    }
  };

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
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {isDragActive
            ? "Drop the files here..."
            : "Drag 'n' drop files here, or click to select files"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Supports PDF, DOCX, and PPT files
        </p>
      </div>
      <input 
        type="file" 
        onChange={handleFileChange} 
        accept=".ppt,.pptx,.pdf,.doc,.docx"
        className="hidden"
      />
      <button 
        onClick={handleSubmit} 
        className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
      >
        Upload File
      </button>
    </div>
  );
}
