import React from 'react';
import './TemplateCard.css';

interface TemplateCardProps {
  title: string;
  imageUrl?: string;
  onUse?: () => void;
  onDelete?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ title, imageUrl, onUse, onDelete }) => {
  return (
    <div className="template-card">
      <div className="card-image-container">
        {imageUrl ? (
          <div className="image-preview" style={{ backgroundImage: `url(${imageUrl})`, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        ) : (
          <div className="image-placeholder">
            <div className="placeholder-content">
              <svg className="broken-image-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <span className="placeholder-text">{title}</span>
            </div>
          </div>
        )}
        <div className="card-overlay">
          <button className="use-template-button" onClick={onUse}>Use Template</button>
          {onDelete && (
            <button 
              className="delete-template-btn-overlay" 
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Are you sure you want to delete the template "${title}"?`)) {
                  onDelete();
                }
              }}
              title="Delete Template"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
