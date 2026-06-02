import React, { useState, useEffect } from 'react';
import { uploadTemplate } from '../../services/templateService';
import './TemplateUploadModal.css';

interface Placeholder {
  id: string;
  label: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  alignment: 'left' | 'center' | 'right';
}

interface TemplateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  initialFile: File | null;
}

const fontFamilies = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: '"Times New Roman", serif', label: 'Times New Roman' },
  { value: '"Courier New", monospace', label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: '"Playfair Display", serif', label: 'Playfair Display' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' }
];

const TemplateUploadModal: React.FC<TemplateUploadModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
  initialFile
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
  const [activePlaceholderId, setActivePlaceholderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialFile) {
      setFile(initialFile);
      setName(initialFile.name.replace(/\.[^/.]+$/, ""));
      const url = URL.createObjectURL(initialFile);
      setPreviewUrl(url);
      setPlaceholders([
        {
          id: 'initial-recipient',
          label: 'Recipient Name',
          x: 50,
          y: 44,
          fontSize: 48,
          color: '#4a2511',
          fontFamily: '"Brush Script MT", "Great Vibes", cursive',
          alignment: 'center'
        },
        {
          id: 'initial-title',
          label: 'Course Title',
          x: 50,
          y: 55,
          fontSize: 22,
          color: '#374151',
          fontFamily: 'Arial, sans-serif',
          alignment: 'center'
        },
        {
          id: 'initial-start-date',
          label: 'Start Date',
          x: 45,
          y: 69,
          fontSize: 16,
          color: '#374151',
          fontFamily: 'Georgia, serif',
          alignment: 'center'
        },
        {
          id: 'initial-end-date',
          label: 'End Date',
          x: 55,
          y: 69,
          fontSize: 16,
          color: '#374151',
          fontFamily: 'Georgia, serif',
          alignment: 'center'
        }
      ]);
      setActivePlaceholderId('initial-recipient');
    } else {
      setFile(null);
      setName('');
      setPreviewUrl('');
      setPlaceholders([]);
    }
  }, [initialFile, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setName(selectedFile.name.replace(/\.[^/.]+$/, ""));
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setPlaceholders([
        {
          id: 'initial-recipient',
          label: 'Recipient Name',
          x: 50,
          y: 44,
          fontSize: 48,
          color: '#4a2511',
          fontFamily: '"Brush Script MT", "Great Vibes", cursive',
          alignment: 'center'
        },
        {
          id: 'initial-title',
          label: 'Course Title',
          x: 50,
          y: 55,
          fontSize: 22,
          color: '#374151',
          fontFamily: 'Arial, sans-serif',
          alignment: 'center'
        },
        {
          id: 'initial-start-date',
          label: 'Start Date',
          x: 45,
          y: 69,
          fontSize: 16,
          color: '#374151',
          fontFamily: 'Georgia, serif',
          alignment: 'center'
        },
        {
          id: 'initial-end-date',
          label: 'End Date',
          x: 55,
          y: 69,
          fontSize: 16,
          color: '#374151',
          fontFamily: 'Georgia, serif',
          alignment: 'center'
        }
      ]);
      setActivePlaceholderId('initial-recipient');
    }
  };

  const handleAddPlaceholder = () => {
    const newPlaceholder: Placeholder = {
      id: Date.now().toString(),
      label: `Field ${placeholders.length + 1}`,
      x: 50,
      y: 50,
      fontSize: 24,
      color: '#000000',
      fontFamily: 'Arial, sans-serif',
      alignment: 'center'
    };
    setPlaceholders(prev => [...prev, newPlaceholder]);
    setActivePlaceholderId(newPlaceholder.id);
  };

  const handleUpdatePlaceholder = (id: string, updates: Partial<Placeholder>) => {
    setPlaceholders(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const handleDeletePlaceholder = (id: string) => {
    setPlaceholders(prev => prev.filter(p => p.id !== id));
    if (activePlaceholderId === id) {
      setActivePlaceholderId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a certificate template image');
      return;
    }
    if (!name.trim()) {
      setError('Please enter a template name');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', file);
    formData.append('placeholders', JSON.stringify(placeholders));

    try {
      await uploadTemplate(formData);
      onSaveSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to save template. Make sure the database server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create Certificate Template</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="modal-layout">
            
            {/* Left Column: Visual Placement & Preview */}
            <div className="preview-section">
              <div className="section-title-bar">
                <h3>Visual Preview</h3>
                <span className="helper-text">Click anywhere on the image to position the active placeholder.</span>
              </div>
              
              {previewUrl ? (
                <div 
                  className="interactive-preview-container"
                  onClick={(e) => {
                    if (!activePlaceholderId) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
                    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
                    handleUpdatePlaceholder(activePlaceholderId, {
                      x: Math.round(clickX * 10) / 10,
                      y: Math.round(clickY * 10) / 10
                    });
                  }}
                >
                  <img src={previewUrl} alt="Template Preview" className="preview-img-base" />
                  
                  {placeholders.map((p) => {
                    const isActive = p.id === activePlaceholderId;
                    return (
                      <div
                        key={p.id}
                        className={`visual-placeholder-overlay ${isActive ? 'active' : ''}`}
                        style={{
                          left: `${p.x}%`,
                          top: `${p.y}%`,
                          fontSize: `${p.fontSize * 0.4}px`, // Scaled for preview layout
                          color: p.color,
                          fontFamily: p.fontFamily,
                          textAlign: p.alignment,
                          transform: p.alignment === 'center' 
                            ? 'translate(-50%, -50%)' 
                            : p.alignment === 'right' 
                            ? 'translate(-100%, -50%)' 
                            : 'translate(0%, -50%)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePlaceholderId(p.id);
                        }}
                      >
                        {p.label || 'Placeholder'}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="upload-dropzone" onClick={() => document.getElementById('template-modal-file')?.click()}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <p>Click to browse and upload template image</p>
                  <span>Supports PNG, JPG, JPEG (Max 10MB)</span>
                </div>
              )}
              
              <input
                id="template-modal-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Right Column: Settings & Placeholders List */}
            <div className="settings-section">
              <div className="input-group-field">
                <label>Template Name</label>
                <input
                  type="text"
                  placeholder="e.g. Certificate of Achievement"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="placeholders-control-header">
                <h3>Placeholders</h3>
                <button
                  type="button"
                  className="add-placeholder-btn"
                  onClick={handleAddPlaceholder}
                  disabled={!file}
                >
                  + Add Placeholder
                </button>
              </div>

              {placeholders.length === 0 ? (
                <div className="placeholders-empty-state">
                  <p>No placeholders added yet.</p>
                  <small>Add placeholders to overlay dynamic fields like Recipient Name, Dates, or Signatures.</small>
                </div>
              ) : (
                <div className="placeholders-list-container">
                  {placeholders.map((p, idx) => {
                    const isActive = p.id === activePlaceholderId;
                    return (
                      <div 
                        key={p.id} 
                        className={`placeholder-item-card ${isActive ? 'active' : ''}`}
                        onClick={() => setActivePlaceholderId(p.id)}
                      >
                        <div className="placeholder-item-card-header">
                          <span className="placeholder-number">#{idx + 1}</span>
                          <button
                            type="button"
                            className="delete-placeholder-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePlaceholder(p.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>

                        <div className="placeholder-fields-grid">
                          <div className="input-group-field span-2">
                            <label>Label / Variable Key</label>
                            <input
                              type="text"
                              value={p.label}
                              onChange={(e) => handleUpdatePlaceholder(p.id, { label: e.target.value })}
                              placeholder="e.g. Recipient Name"
                            />
                          </div>

                          <div className="input-group-field">
                            <label>X Position (%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              value={p.x}
                              onChange={(e) => handleUpdatePlaceholder(p.id, { x: parseFloat(e.target.value) || 0 })}
                            />
                          </div>

                          <div className="input-group-field">
                            <label>Y Position (%)</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              value={p.y}
                              onChange={(e) => handleUpdatePlaceholder(p.id, { y: parseFloat(e.target.value) || 0 })}
                            />
                          </div>

                          <div className="input-group-field">
                            <label>Font Size (px)</label>
                            <input
                              type="number"
                              min="8"
                              max="120"
                              value={p.fontSize}
                              onChange={(e) => handleUpdatePlaceholder(p.id, { fontSize: parseInt(e.target.value) || 12 })}
                            />
                          </div>

                          <div className="input-group-field">
                            <label>Text Color</label>
                            <div className="color-picker-wrapper">
                              <input
                                type="color"
                                value={p.color}
                                onChange={(e) => handleUpdatePlaceholder(p.id, { color: e.target.value })}
                              />
                              <input
                                type="text"
                                className="color-hex-input"
                                value={p.color}
                                onChange={(e) => handleUpdatePlaceholder(p.id, { color: e.target.value })}
                              />
                            </div>
                          </div>

                          <div className="input-group-field">
                            <label>Font Family</label>
                            <select
                              value={p.fontFamily}
                              onChange={(e) => handleUpdatePlaceholder(p.id, { fontFamily: e.target.value })}
                            >
                              {fontFamilies.map(f => (
                                <option key={f.value} value={f.value}>{f.label}</option>
                              ))}
                            </select>
                          </div>

                          <div className="input-group-field">
                            <label>Alignment</label>
                            <select
                              value={p.alignment}
                              onChange={(e) => handleUpdatePlaceholder(p.id, { alignment: e.target.value as any })}
                            >
                              <option value="left">Left</option>
                              <option value="center">Center</option>
                              <option value="right">Right</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {error && <div className="modal-error-message">{error}</div>}

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={isSubmitting || !file}>
              {isSubmitting ? 'Saving Template...' : 'Save Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateUploadModal;
