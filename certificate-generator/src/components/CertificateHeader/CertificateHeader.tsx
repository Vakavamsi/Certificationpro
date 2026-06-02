import React from 'react';
import './CertificateHeader.css';

const CertificateHeader: React.FC = () => {
  return (
    <header className="certificate-header">
      <div className="header-container">
        <div className="header-icon-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="header-icon"
          >
            <path d="M12 15l-2 5l9-9l-9-9l2 5l-9 9z" /> {/* Placeholder icon, will fix with actual bookmark/medal */}
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
          </svg>
        </div>
        <div className="header-text">
          <h1 className="header-title">Certificate Studio</h1>
          <p className="header-subtitle">
            Upload templates, fill details, generate certificates
          </p>
        </div>
      </div>
    </header>
  );
};

export default CertificateHeader;
