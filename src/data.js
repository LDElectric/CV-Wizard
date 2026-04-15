export const TEMPLATES = [
  {
    id: 'modelo-pdf',
    name: 'Basico',
    description: 'Replica o layout textual do modelo.pdf com as mesmas secoes.',
    accentDefault: '#111827',
    fontDefault: 'Inter',
  },
  {
    id: 'classico-profissional',
    name: 'Clássico Profissional',
    description: 'Coluna única, clean e profissional. Baseado no CV em Word.',
    accentDefault: '#2563eb',
    fontDefault: 'Inter',
  },
  {
    id: 'modern-sidebar',
    name: 'Barra Lateral Moderna',
    description: 'Barra lateral colorida com foto, contato e habilidades.',
    accentDefault: '#0f766e',
    fontDefault: 'Outfit',
  },
  {
    id: 'executive',
    name: 'Executivo',
    description: 'Cabeçalho dividido: nome à esquerda, contato à direita. Elegante.',
    accentDefault: '#1e3a5f',
    fontDefault: 'Merriweather',
  },
  {
    id: 'creative',
    name: 'Criativo',
    description: 'Cabeçalho em bloco colorido. Seções com badges modernos.',
    accentDefault: '#7c3aed',
    fontDefault: 'Outfit',
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Tipografia pura. Máximo espaço em branco, sem ícones.',
    accentDefault: '#334155',
    fontDefault: 'Georgia',
  },
];

export const COLORS = [
  { label: 'Azul', value: '#2563eb' },
  { label: 'Azul Naval', value: '#1e3a5f' },
  { label: 'Verde Teal', value: '#0f766e' },
  { label: 'Índigo', value: '#4f46e5' },
  { label: 'Roxo', value: '#7c3aed' },
  { label: 'Rosa', value: '#be185d' },
  { label: 'Vermelho', value: '#dc2626' },
  { label: 'Laranja', value: '#ea580c' },
  { label: 'Chumbo', value: '#334155' },
  { label: 'Preto', value: '#111827' },
];

export const FONTS = [
  { label: 'Inter (Moderna)', value: 'Inter' },
  { label: 'Outfit (Clean)', value: 'Outfit' },
  { label: 'Georgia (Clássica)', value: 'Georgia' },
  { label: 'Merriweather (Serif)', value: 'Merriweather' },
  { label: 'Playfair Display (Elegante)', value: 'Playfair Display' },
];

export const LANGUAGE_LEVELS = [
  'Básico', 'Elementar', 'Pré-intermediário', 'Intermediário',
  'Intermediário-Superior', 'Avançado', 'Fluente', 'Nativo',
];

export const LEVEL_TO_NUM = {
  'Básico': 1, 'Elementar': 1, 'Pré-intermediário': 2, 'Intermediário': 3,
  'Intermediário-Superior': 3, 'Avançado': 4, 'Fluente': 5, 'Nativo': 5,
};

export const initialCVState = {
  theme: {
    template: 'classico-profissional',
    color: '#2563eb',
    font: 'Inter',
    bulletPoints: true,
    showPhoto: false,
  },
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    instagram: '',
    website: '',
    photo: null,
  },
  summary: '',
  experience: [],
  education: [],
  technicalSkills: [],
  softSkills: [],
  languages: [],
  certifications: [],
  courses: [],
  interests: '',
  sections: {
    summary:        { visible: true,  label: 'Resumo Profissional' },
    experience:     { visible: true,  label: 'Experiência Profissional' },
    education:      { visible: true,  label: 'Formação Acadêmica' },
    technicalSkills:{ visible: true,  label: 'Competências Técnicas' },
    softSkills:     { visible: true,  label: 'Competências Pessoais' },
    languages:      { visible: true,  label: 'Idiomas' },
    certifications: { visible: true,  label: 'Certificações' },
    courses:        { visible: true,  label: 'Cursos e Treinamentos' },
    interests:      { visible: false, label: 'Interesses' },
  },
};
