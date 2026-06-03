import React, { useState, useEffect } from 'react';
import CertificateHeader from '../../components/CertificateHeader/CertificateHeader';
import GalleryToolbar from '../../components/GalleryToolbar/GalleryToolbar';
import TemplateCard from '../../components/TemplateCard/TemplateCard';
import TemplateUploadModal from '../../components/TemplateUploadModal/TemplateUploadModal';
import { getTemplates, deleteTemplate } from '../../services/templateService';
import './CertificateStudio.css';

export interface Placeholder {
  id: string;
  label: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  alignment: 'left' | 'center' | 'right';
}

export interface Template {
  id: number;
  name: string;
  image: string;
  placeholders: Placeholder[];
}

interface CertificateStudioProps {
  onUseTemplate: (template: Template) => void;
}

const CertificateStudio: React.FC<CertificateStudioProps> = ({ onUseTemplate }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadTemplates = async () => {
    try {
      const data = await getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleUploadInitiated = (file: File) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTemplate(id);
      loadTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="certificate-studio">
      <CertificateHeader />
      <main className="studio-main">
        <div className="gallery-header">
          <h2 className="gallery-title">Template Gallery</h2>
          <p className="gallery-subtitle">
            Choose a template to fill in details and generate a certificate.
          </p>
        </div>
        
        <GalleryToolbar onUpload={handleUploadInitiated} onSearchChange={setSearchQuery} />
        
        {filteredTemplates.length === 0 ? (
          <div className="empty-gallery-state" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p>No templates found. Click "Upload Template" to create one.</p>
          </div>
        ) : (
          <div className="template-grid">
            {filteredTemplates.map((template) => (
              <TemplateCard 
                key={template.id} 
                title={template.name} 
                imageUrl={template.image.startsWith('/') ? `${import.meta.env.VITE_BACKEND_URL}${template.image}` : template.image}
                onUse={() => onUseTemplate(template)}
                onDelete={() => handleDelete(template.id)}
              />
            ))}
          </div>
        )}
      </main>

      <TemplateUploadModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFile(null);
        }}
        onSaveSuccess={loadTemplates}
        initialFile={selectedFile}
      />
    </div>
  );
};

export default CertificateStudio;
