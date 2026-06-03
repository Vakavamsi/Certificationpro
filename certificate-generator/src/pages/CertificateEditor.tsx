import React, { useState, useEffect } from 'react';
import CertificatePreview from '../components/certificate/CertificatePreview';
import type { Template } from './CertificateStudio/CertificateStudio';
import { generateCertificate } from '../services/certificateService';
import './CertificateEditor.css';

interface CertificateEditorProps {
  template: Template;
  onBack: () => void;
}

const CertificateEditor: React.FC<CertificateEditorProps> = ({ template, onBack }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);

  // Force override the template placeholders with our custom ones for this specific design
  const activePlaceholders = [
    {
      id: 'default-recipient',
      label: 'Recipient Name',
      x: 50,
      y: 41,
      fontSize: 56,
      color: '#8b4513',
      fontFamily: 'Georgia, "Times New Roman", serif',
      alignment: 'center' as const,
    },
    {
      id: 'default-start-date',
      label: 'Start Date',
      x: 50,
      y: 62,
      fontSize: 18,
      color: '#8b4513',
      fontFamily: 'Georgia, "Times New Roman", serif',
      alignment: 'center' as const,
    },
    {
      id: 'default-end-date',
      label: 'End Date',
      x: 50,
      y: 71,
      fontSize: 18,
      color: '#8b4513',
      fontFamily: 'Georgia, "Times New Roman", serif',
      alignment: 'center' as const,
    }
  ];

  useEffect(() => {
    const initial: Record<string, string> = {};
    activePlaceholders.forEach((p) => {
      initial[p.label] = '';
    });
    setFormData(initial);
  }, [template]);

  const generateCertificateImage = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const imageUrl = template.image.startsWith('/') 
        ? import.meta.env.VITE_BACKEND_URL
        : template.image;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // Draw background template
        ctx.drawImage(img, 0, 0);

        // Draw overlays
        activePlaceholders.forEach((p) => {
          const value = formData[p.label] || '';
          const xPixel = (p.x / 100) * img.naturalWidth;
          const yPixel = (p.y / 100) * img.naturalHeight;

          // Mask underlying printed template text if mask dimensions exist
          if ((p as any).maskWidth && (p as any).maskHeight) {
            const maskW = (((p as any).maskWidth) / 100) * img.naturalWidth;
            const maskH = (((p as any).maskHeight) / 100) * img.naturalHeight;
            ctx.save();
            ctx.fillStyle = '#ffffff'; // Pure white to cover underlying template text
            ctx.fillRect(xPixel - maskW / 2, yPixel - maskH / 2, maskW, maskH);
            ctx.restore();
          }

          ctx.save();
          ctx.fillStyle = p.color;
          ctx.font = `bold ${p.fontSize}px ${p.fontFamily}`;
          ctx.textAlign = p.alignment as CanvasTextAlign;
          ctx.textBaseline = 'middle';

          ctx.fillText(value, xPixel, yPixel);
          ctx.restore();
        });

        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = () => {
        reject(new Error('Failed to load template image'));
      };

      img.src = imageUrl;
    });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const base64Image = await generateCertificateImage();
      setLocalImageUrl(base64Image);
      const response = await generateCertificate({
        templateId: template.id,
        recipientName: Object.values(formData)[0] || 'Recipient',
        details: formData,
        imageBase64: base64Image
      });

      if (response && response.imageUrl) {
        setGeneratedUrl(`${import.meta.env.VITE_BACKEND_URL}${response.imageUrl}`);
      } else {
        setGeneratedUrl(base64Image);
      }
      setStep(3);
    } catch (err) {
      console.error('Failed to generate and save certificate:', err);
      // Local fallback in case server connection fails
      try {
        const base64Image = await generateCertificateImage();
        setLocalImageUrl(base64Image);
        setGeneratedUrl(base64Image);
        setStep(3);
      } catch (innerErr) {
        alert('Could not render certificate image.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const targetUrl = localImageUrl || generatedUrl;
    if (!targetUrl) return;
    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = `${template.name.replace(/\s+/g, '_')}_Certificate.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWhatsAppShare = () => {
    if (!generatedUrl) return;
    const text = `Hi! I just generated a certificate for ${Object.values(formData)[0] || 'myself'} using Certificate Studio! Check it out: ${generatedUrl.startsWith('data:') ? 'Local PNG' : generatedUrl}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="certificate-editor-page">
      <header className="editor-top-nav">
        <div className="nav-left">
          <button className="back-button" onClick={onBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Gallery
          </button>
          <span className="nav-divider">|</span>
          <span className="nav-template-name">{template.name}</span>
        </div>
        
        <div className="stepper">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Fill Details</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Preview</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Download</div>
        </div>
      </header>

      <main className="editor-main">
        <div className="editor-sidebar-container">
          {/* Step 1: Fill Details */}
          {step === 1 && (
            <div className="sidebar-card form-card">
              <h3 className="form-title">Certificate Details</h3>
              <p className="form-subtitle">Fill in the details to generate the certificate.</p>
              
              <div className="placeholders-inputs-list">
                {activePlaceholders.map((p) => {
                  const isDate = p.label.toLowerCase().includes('date');
                  return (
                    <div className="input-group" key={p.id}>
                      <label>{p.label}</label>
                      <input 
                        type={isDate ? "date" : "text"} 
                        placeholder={`Enter ${p.label}`} 
                        value={formData[p.label] || ''}
                        onChange={(e) => setFormData({...formData, [p.label]: e.target.value})}
                      />
                    </div>
                  );
                })}
              </div>

              <button className="preview-button" onClick={() => setStep(2)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Preview Certificate
              </button>
            </div>
          )}

          {/* Step 2: Confirm & Generate */}
          {step === 2 && (
            <div className="sidebar-card form-card">
              <h3 className="form-title">Verify Details</h3>
              <p className="form-subtitle">Please verify that all information is correct before generating.</p>
              
              <div className="verification-summary-list">
                {activePlaceholders.map((p) => (
                  <div className="summary-item" key={p.id}>
                    <span className="summary-item-label">{p.label}:</span>
                    <span className="summary-item-value">{formData[p.label] || <em>Not specified</em>}</span>
                  </div>
                ))}
              </div>

              <div className="button-group-row">
                <button className="secondary-editor-btn" onClick={() => setStep(1)}>
                  Back
                </button>
                <button className="primary-editor-btn" onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : 'Confirm & Generate'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success & Download */}
          {step === 3 && (
            <div className="sidebar-card form-card">
              <h3 className="form-title" style={{ color: '#10b981' }}>Success!</h3>
              <p className="form-subtitle">Your certificate has been generated successfully.</p>

              <div className="action-buttons-stack">
                <button className="download-button" onClick={handleDownload}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download PNG
                </button>
                
                <button className="share-whatsapp-btn" onClick={handleWhatsAppShare}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  Share via WhatsApp
                </button>
              </div>

              <button className="restart-btn" onClick={() => {
                setStep(1);
                setGeneratedUrl(null);
              }}>
                Create Another
              </button>
            </div>
          )}
        </div>
        
        <div className="editor-preview-container">
          <CertificatePreview 
            template={template} 
            formData={formData} 
          />
        </div>
      </main>
    </div>
  );
};

export default CertificateEditor;