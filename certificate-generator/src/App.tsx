import { useState } from 'react';
import CertificateStudio, { type Template } from './pages/CertificateStudio/CertificateStudio';
import CertificateEditor from './pages/CertificateEditor';
import './App.css';

function App() {
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);

  return (
    <>
      {activeTemplate ? (
        <CertificateEditor 
          template={activeTemplate} 
          onBack={() => setActiveTemplate(null)} 
        />
      ) : (
        <CertificateStudio 
          onUseTemplate={(template) => setActiveTemplate(template)} 
        />
      )}
    </>
  );
}

export default App;