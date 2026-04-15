const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const DATE_RANGE_RE = new RegExp(`(${MONTHS.join('|')})\\s+\\d{4}\\s*[\\-–]\\s*((?:${MONTHS.join('|')})\\s+\\d{4}|atual)`, 'i');

function normalizeHeading(line) {
  return line
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z ]/gi, '')
    .trim()
    .toUpperCase();
}

function cleanText(text) {
  return text
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitSections(text) {
  const lines = cleanText(text).split('\n').map((l) => l.trim()).filter(Boolean);
  const sectionKeys = {
    'DADOS PESSOAIS': 'personal',
    'RESUMO PROFISSIONAL': 'summary',
    FORMACAO: 'education',
    'FORMACAO ACADEMICA': 'education',
    EXPERIENCIA: 'experience',
    COMPETENCIAS: 'skills',
    IDIOMAS: 'languages',
    INTERESSES: 'interests',
    CURSOS: 'courses',
    CERTIFICACOES: 'courses',
  };

  const sections = {};
  const preface = [];
  let current = null;

  for (const line of lines) {
    const key = sectionKeys[normalizeHeading(line)];
    if (key) {
      current = key;
      if (!sections[current]) sections[current] = [];
      continue;
    }

    if (!current) {
      preface.push(line);
    } else {
      sections[current].push(line);
    }
  }

  return { sections, preface };
}

function extractEmail(text) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || '';
}

function extractPhone(text) {
  return text.match(/(?:\+?55\s*)?(?:\(?\d{2}\)?\s*)?\d{4,5}[\s-]?\d{4}/)?.[0] || '';
}

function extractLink(text, host) {
  const re = new RegExp(`(?:https?:\\/\\/)?(?:www\\.)?${host.replace('.', '\\.')}(?:\\/[\\w\\-./?%&=]*)?`, 'i');
  return text.match(re)?.[0] || '';
}

function parseDateLine(line) {
  const dateMatch = line.match(DATE_RANGE_RE);
  if (!dateMatch) return null;

  const date = dateMatch[0].replace(/\s+/g, ' ').trim();
  const role = line.replace(dateMatch[0], '').replace(/[\-–|,]+$/, '').trim();
  return { role, date };
}

function parseTimelineItems(lines, includeLocation = true) {
  const items = [];
  let i = 0;

  while (i < lines.length) {
    const parsed = parseDateLine(lines[i]);
    if (!parsed) {
      i += 1;
      continue;
    }

    const item = {
      id: `${Date.now()}-${i}-${Math.random().toString(16).slice(2, 7)}`,
      org: '',
      role: parsed.role,
      date: parsed.date,
      location: '',
      description: '',
    };

    i += 1;
    if (i < lines.length && !parseDateLine(lines[i])) {
      item.org = lines[i];
      if (includeLocation && item.org.includes(',')) {
        const parts = item.org.split(',').map((p) => p.trim());
        item.org = parts.shift() || item.org;
        item.location = parts.join(', ');
      }
      i += 1;
    }

    const desc = [];
    while (i < lines.length && !parseDateLine(lines[i])) {
      desc.push(lines[i]);
      i += 1;
    }
    item.description = desc.join('\n').trim();

    items.push(item);
  }

  return items;
}

function parseSkills(lines) {
  const technical = [];
  const soft = [];
  let target = technical;

  for (const line of lines) {
    const heading = normalizeHeading(line);
    if (heading.includes('PESSOAIS')) {
      target = soft;
      continue;
    }
    if (heading.includes('PROFISSIONAIS')) {
      target = technical;
      continue;
    }

    const cleaned = line.replace(/^[-•]\s*/, '').trim();
    if (!cleaned) continue;
    if (cleaned.length < 2) continue;
    if (!target.includes(cleaned)) target.push(cleaned);
  }

  return { technical, soft };
}

function parseLanguages(lines) {
  return lines
    .map((line, idx) => {
      const [language, level] = line.split(/[-–]/).map((x) => x.trim());
      if (!language) return null;
      const l = (level || 'Intermediário').toLowerCase();
      let levelNum = 3;
      if (l.includes('basic')) levelNum = 1;
      if (l.includes('basico')) levelNum = 1;
      if (l.includes('avanc')) levelNum = 4;
      if (l.includes('fluente') || l.includes('nativo')) levelNum = 5;
      return {
        id: `${Date.now()}-lang-${idx}`,
        language,
        level: level || 'Intermediário',
        levelNum,
      };
    })
    .filter(Boolean);
}

function parseCourses(lines) {
  return lines
    .map((line, idx) => {
      const cleaned = line.replace(/^[-•]\s*/, '').trim();
      if (!cleaned) return null;
      return {
        id: `${Date.now()}-course-${idx}`,
        name: cleaned,
        institution: '',
        date: '',
      };
    })
    .filter(Boolean);
}

function chooseName(preface) {
  if (!preface.length) return '';
  return preface[0]
    .replace(/[^A-Za-zÀ-ÿ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function chooseTitle(preface) {
  if (preface.length < 2) return '';
  return preface[1].trim();
}

export async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'txt' || ext === 'md') {
    return cleanText(await file.text());
  }

  if (ext === 'docx') {
    const mammoth = (await import('mammoth')).default;
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return cleanText(result.value || '');
  }

  if (ext === 'pdf') {
    const [{ GlobalWorkerOptions, getDocument }, pdfWorker] = await Promise.all([
      import('pdfjs-dist/legacy/build/pdf.mjs'),
      import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
    ]);

    GlobalWorkerOptions.workerSrc = pdfWorker.default;
    const buffer = await file.arrayBuffer();
    const loadingTask = getDocument({ data: new Uint8Array(buffer) });
    const pdf = await loadingTask.promise;
    const pages = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const text = content.items.map((item) => item.str).join(' ');
      pages.push(text);
    }

    return cleanText(pages.join('\n'));
  }

  throw new Error('Formato nao suportado. Use PDF, DOCX ou TXT.');
}

export function parseCvFromText(text, currentCv) {
  const { sections, preface } = splitSections(text);

  const mergedText = cleanText(text);
  const email = extractEmail(mergedText);
  const phone = extractPhone(mergedText);
  const linkedin = extractLink(mergedText, 'linkedin.com');
  const github = extractLink(mergedText, 'github.com');
  const instagram = extractLink(mergedText, 'instagram.com');

  const experience = parseTimelineItems(sections.experience || [], true)
    .filter((it) => it.org || it.role || it.description);

  const educationRaw = parseTimelineItems(sections.education || [], false)
    .filter((it) => it.org || it.role);

  const education = educationRaw.map((it) => ({
    id: it.id,
    org: it.org,
    role: it.role,
    date: it.date,
    description: it.description,
  }));

  const { technical, soft } = parseSkills(sections.skills || []);
  const languages = parseLanguages(sections.languages || []);
  const courses = parseCourses(sections.courses || []);

  const summary = (sections.summary || []).join(' ').trim();
  const interests = (sections.interests || []).join(' ').trim();

  const next = {
    ...currentCv,
    personal: {
      ...currentCv.personal,
      name: chooseName(preface) || currentCv.personal.name,
      title: chooseTitle(preface) || currentCv.personal.title,
      email: email || currentCv.personal.email,
      phone: phone || currentCv.personal.phone,
      linkedin: linkedin || currentCv.personal.linkedin,
      github: github || currentCv.personal.github,
      instagram: instagram || currentCv.personal.instagram,
    },
    summary: summary || currentCv.summary,
    experience: experience.length ? experience : currentCv.experience,
    education: education.length ? education : currentCv.education,
    technicalSkills: technical.length ? technical : currentCv.technicalSkills,
    softSkills: soft.length ? soft : currentCv.softSkills,
    languages: languages.length ? languages : currentCv.languages,
    courses: courses.length ? courses : currentCv.courses,
    interests: interests || currentCv.interests,
  };

  // Try to infer address from personal section lines that are not obvious links/contacts.
  const personalLines = sections.personal || [];
  const addressCandidate = personalLines.find((line) => {
    const lc = line.toLowerCase();
    if (line.includes('@')) return false;
    if (lc.includes('linkedin') || lc.includes('github') || lc.includes('instagram') || lc.includes('http')) return false;
    if (line.match(/\d{4,5}[\s-]?\d{4}/)) return false;
    return line.length > 4;
  });
  if (addressCandidate) {
    next.personal.address = addressCandidate;
  }

  return next;
}
