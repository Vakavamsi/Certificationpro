import React, { useRef } from 'react';
import './GalleryToolbar.css';

interface GalleryToolbarProps {
  onUpload: (file: File) => void;
  onSearchChange?: (search: string) => void;
}

const GalleryToolbar: React.FC<GalleryToolbarProps> = ({ onUpload, onSearchChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="gallery-toolbar">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search templates..."
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      <input 
        type="file" 
        accept="image/*" 
        style={{ display: 'none' }} 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      <button className="upload-button" onClick={handleUploadClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Upload Template
      </button>
    </div>
  );
};

export default GalleryToolbar;
