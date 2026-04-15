import { useState, useEffect, useCallback } from 'react';
import { initialCVState } from './data';
import { extractTextFromFile, parseCvFromText } from './utils/cvImport';
import Sidebar from './components/Sidebar';
import Preview from './components/Preview';
import './index.css';

function App() {
  const [cv, setCv] = useState(initialCVState);
  const [importStatus, setImportStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    document.documentElement.style.setProperty('--cv-accent', cv.theme.color);
    document.documentElement.style.setProperty('--cv-font', `'${cv.theme.font}', sans-serif`);
  }, [cv.theme.color, cv.theme.font]);

  const updatePersonal  = useCallback((field, value) => setCv(p => ({ ...p, personal: { ...p.personal, [field]: value } })), []);
  const updateTheme     = useCallback((field, value) => setCv(p => ({ ...p, theme: { ...p.theme, [field]: value } })), []);
  const updateField     = useCallback((field, value) => setCv(p => ({ ...p, [field]: value })), []);

  const addItem = useCallback((section) => {
    const defaults = {
      experience:     { id: Date.now().toString(), org: '', role: '', date: '', location: '', description: '' },
      education:      { id: Date.now().toString(), org: '', role: '', date: '', description: '' },
      languages:      { id: Date.now().toString(), language: '', level: 'Intermediário', levelNum: 3 },
      certifications: { id: Date.now().toString(), name: '', issuer: '', date: '', validity: '' },
      courses:        { id: Date.now().toString(), name: '', institution: '', date: '' },
    };
    setCv(p => ({ ...p, [section]: [...p[section], defaults[section]] }));
  }, []);

  const removeItem = useCallback((section, id) =>
    setCv(p => ({ ...p, [section]: p[section].filter(item => item.id !== id) })), []);

  const updateItem = useCallback((section, id, field, value) =>
    setCv(p => ({
      ...p,
      [section]: p[section].map(item => item.id === id ? { ...item, [field]: value } : item),
    })), []);

  const toggleSection = useCallback((key) =>
    setCv(p => ({
      ...p,
      sections: { ...p.sections, [key]: { ...p.sections[key], visible: !p.sections[key].visible } },
    })), []);

  const handleImportCv = useCallback(async (file) => {
    if (!file) return;
    setImportStatus({ type: 'loading', message: `Lendo arquivo: ${file.name}...` });

    try {
      const text = await extractTextFromFile(file);
      if (!text || text.length < 20) {
        throw new Error('Nao foi possivel extrair texto util do arquivo.');
      }

      setCv((prev) => parseCvFromText(text, prev));
      setImportStatus({ type: 'success', message: 'Curriculo importado. Revise os campos e ajuste se necessario.' });
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error?.message || 'Erro ao importar curriculo. Use PDF, DOCX ou TXT.',
      });
    }
  }, []);

  return (
    <div className="app-container">
      <Sidebar
        cv={cv}
        updatePersonal={updatePersonal}
        updateTheme={updateTheme}
        updateField={updateField}
        addItem={addItem}
        removeItem={removeItem}
        updateItem={updateItem}
        toggleSection={toggleSection}
        onImportCv={handleImportCv}
        importStatus={importStatus}
      />
      <Preview cv={cv} updateTheme={updateTheme} />
    </div>
  );
}

export default App;
