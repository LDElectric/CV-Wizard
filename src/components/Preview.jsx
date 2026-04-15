import { COLORS, FONTS } from '../data';
import LeonamClassic from '../templates/LeonamClassic';
import ModernSidebar from '../templates/ModernSidebar';
import Executive from '../templates/Executive';
import Creative from '../templates/Creative';
import Minimal from '../templates/Minimal';
import ModeloPdf from '../templates/ModeloPdf';
import '../templates/templates.css';

const TEMPLATE_MAP = {
  'modelo-pdf': ModeloPdf,
  'classico-profissional': LeonamClassic,
  'modern-sidebar': ModernSidebar,
  'executive': Executive,
  'creative': Creative,
  'minimal': Minimal,
};

const SAMPLE_PREVIEW = {
  personal: {
    name: 'NOME SOBRENOME',
    title: 'Cargo Desejado | Area de Atuacao',
    email: 'email@exemplo.com',
    phone: '(11) 99999-9999',
    address: 'Cidade, Estado',
    linkedin: 'linkedin.com/in/seu-perfil',
    github: 'github.com/seuusuario',
    instagram: 'instagram.com/seuperfil',
    website: 'seusite.com',
  },
  summary: 'Resumo profissional: descreva sua experiencia, principais resultados e objetivos de carreira de forma clara e objetiva.',
  experience: [
    {
      id: 'sample-exp-1',
      org: 'Nome da Empresa',
      role: 'Cargo / Funcao',
      date: 'jan 2022 - Atual',
      location: 'Cidade, Estado',
      description: 'Principal responsabilidade ou resultado alcancado.\nTecnologias, ferramentas ou processos utilizados.\nImpacto gerado no negocio.',
    },
  ],
  education: [
    {
      id: 'sample-edu-1',
      org: 'Nome da Instituicao',
      role: 'Curso / Formacao',
      date: 'jan 2018 - dez 2021',
      description: 'Cidade, Estado',
    },
  ],
  technicalSkills: ['Competencia Tecnica 1', 'Competencia Tecnica 2', 'Competencia Tecnica 3'],
  softSkills: ['Trabalho em equipe', 'Comunicacao', 'Resolucao de problemas'],
  languages: [{ id: 'sample-lang-1', language: 'Ingles', level: 'Intermediario', levelNum: 3 }],
  certifications: [{ id: 'sample-cert-1', name: 'Nome da Certificacao', issuer: 'Instituicao', date: '', validity: '2028' }],
  courses: [{ id: 'sample-course-1', name: 'Nome do Curso', institution: 'Plataforma / Escola', date: '2025' }],
  interests: 'Interesses profissionais e areas de estudo.',
};

function withPreviewFallback(cv) {
  return {
    ...cv,
    personal: {
      ...cv.personal,
      name: cv.personal.name || SAMPLE_PREVIEW.personal.name,
      title: cv.personal.title || SAMPLE_PREVIEW.personal.title,
      email: cv.personal.email || SAMPLE_PREVIEW.personal.email,
      phone: cv.personal.phone || SAMPLE_PREVIEW.personal.phone,
      address: cv.personal.address || SAMPLE_PREVIEW.personal.address,
      linkedin: cv.personal.linkedin || SAMPLE_PREVIEW.personal.linkedin,
      github: cv.personal.github || SAMPLE_PREVIEW.personal.github,
      instagram: cv.personal.instagram || SAMPLE_PREVIEW.personal.instagram,
      website: cv.personal.website || SAMPLE_PREVIEW.personal.website,
    },
    summary: cv.summary || SAMPLE_PREVIEW.summary,
    experience: cv.experience.length ? cv.experience : SAMPLE_PREVIEW.experience,
    education: cv.education.length ? cv.education : SAMPLE_PREVIEW.education,
    technicalSkills: cv.technicalSkills.length ? cv.technicalSkills : SAMPLE_PREVIEW.technicalSkills,
    softSkills: cv.softSkills.length ? cv.softSkills : SAMPLE_PREVIEW.softSkills,
    languages: cv.languages.length ? cv.languages : SAMPLE_PREVIEW.languages,
    certifications: cv.certifications.length ? cv.certifications : SAMPLE_PREVIEW.certifications,
    courses: cv.courses.length ? cv.courses : SAMPLE_PREVIEW.courses,
    interests: cv.interests || SAMPLE_PREVIEW.interests,
  };
}

export default function Preview({ cv, updateTheme }) {
  const previewCv = withPreviewFallback(cv);
  const TemplateComponent = TEMPLATE_MAP[cv.theme.template] || LeonamClassic;

  const formatDescription = (text) => {
    if (!text) return null;
    const lines = text.split('\n').filter(l => l.trim());
    if (cv.theme.bulletPoints) {
      return <ul className="cv-desc-list">{lines.map((line, i) => <li key={i}>{line}</li>)}</ul>;
    }
    return lines.map((line, i) => <p key={i} style={{ marginBottom: '3px', textAlign: 'justify' }}>{line}</p>);
  };

  return (
    <div className="preview-area">
      <div className="toolbar">
        <div className="toolbar-controls">
          <span className="toolbar-label">Cor:</span>
          {COLORS.map(c => (
            <div
              key={c.value}
              className={`theme-swatch ${cv.theme.color === c.value ? 'active' : ''}`}
              style={{ backgroundColor: c.value }}
              title={c.label}
              onClick={() => updateTheme('color', c.value)}
            />
          ))}
          <div className="toolbar-sep" />
          <select
            value={cv.theme.font}
            onChange={e => updateTheme('font', e.target.value)}
            className="toolbar-select"
          >
            {FONTS.map(f => <option key={f.value} value={f.value}>{f.label.split(' ')[0]}</option>)}
          </select>
        </div>
        <button className="btn" onClick={() => window.print()}>🖨️ Exportar PDF</button>
      </div>

      <div className="cv-viewport">
        <TemplateComponent cv={previewCv} formatDescription={formatDescription} />
      </div>
    </div>
  );
}
