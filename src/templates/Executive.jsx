import { normalizeEmail, normalizeExternalUrl, normalizePhone } from './linkUtils';

export default function Executive({ cv, formatDescription }) {
  const { personal, summary, experience, education, technicalSkills, softSkills, languages, certifications, courses, sections, theme } = cv;

  return (
    <div className="cv-document cv-executive" style={{ fontFamily: `'${theme.font}', Georgia, serif` }}>
      {/* SPLIT HEADER */}
      <div className="ex-header">
        <div className="ex-header-left">
          {personal.photo && <img src={personal.photo} alt="" className="ex-photo" />}
          <div>
            <div className="ex-name">{personal.name}</div>
            <div className="ex-title">{personal.title}</div>
          </div>
        </div>
        <div className="ex-header-right">
          {personal.email    && <div className="ex-contact-line">✉ <a href={normalizeEmail(personal.email)}>{personal.email}</a></div>}
          {personal.phone    && <div className="ex-contact-line">✆ <a href={normalizePhone(personal.phone)}>{personal.phone}</a></div>}
          {personal.address  && <div className="ex-contact-line">⊙ {personal.address}</div>}
          {personal.linkedin && <div className="ex-contact-line">in <a href={normalizeExternalUrl(personal.linkedin)} target="_blank" rel="noreferrer">{personal.linkedin}</a></div>}
          {personal.github   && <div className="ex-contact-line">⌥ <a href={normalizeExternalUrl(personal.github)} target="_blank" rel="noreferrer">{personal.github}</a></div>}
          {personal.instagram && <div className="ex-contact-line">◎ <a href={normalizeExternalUrl(personal.instagram)} target="_blank" rel="noreferrer">{personal.instagram}</a></div>}
          {personal.website  && <div className="ex-contact-line">🌐 <a href={normalizeExternalUrl(personal.website)} target="_blank" rel="noreferrer">{personal.website}</a></div>}
        </div>
      </div>
      <div className="ex-rule" />

      {/* RESUMO */}
      {sections.summary.visible && summary && (
        <div className="ex-section">
          <div className="ex-section-title">Resumo Profissional</div>
          <p className="cl-paragraph">{summary}</p>
        </div>
      )}

      {/* EXPERIÊNCIA */}
      {sections.experience.visible && experience.length > 0 && (
        <div className="ex-section">
          <div className="ex-section-title">Experiência Profissional</div>
          {experience.map(exp => (
            <div className="ex-item" key={exp.id}>
              <div className="ex-item-header">
                <div>
                  <span className="ex-org">{exp.org}</span>
                  {exp.location && <span className="ex-loc"> — {exp.location}</span>}
                </div>
                <span className="ex-date">{exp.date}</span>
              </div>
              {exp.role && <div className="ex-role">{exp.role}</div>}
              <div className="cl-desc">{formatDescription(exp.description)}</div>
            </div>
          ))}
        </div>
      )}

      {/* FORMAÇÃO */}
      {sections.education.visible && education.length > 0 && (
        <div className="ex-section">
          <div className="ex-section-title">Formação Acadêmica</div>
          {education.map(edu => (
            <div className="ex-item" key={edu.id}>
              <div className="ex-item-header">
                <div>
                  <span className="ex-org">{edu.org}</span>
                  {edu.description && <span className="ex-loc"> — {edu.description}</span>}
                </div>
                <span className="ex-date">{edu.date}</span>
              </div>
              {edu.role && <div className="ex-role">{edu.role}</div>}
            </div>
          ))}
        </div>
      )}

      {/* BOTTOM 2-COLUMN */}
      <div className="ex-bottom-cols">
        <div>
          {sections.technicalSkills.visible && technicalSkills.length > 0 && (
            <div className="ex-section" style={{ marginBottom: '10px' }}>
              <div className="ex-section-title">Competências Técnicas</div>
              <div className="ex-skill-list">
                {technicalSkills.map(s => <span key={s}>· {s}</span>)}
              </div>
            </div>
          )}
          {sections.softSkills.visible && softSkills.length > 0 && (
            <div className="ex-section">
              <div className="ex-section-title">Competências Pessoais</div>
              <div className="ex-skill-list">
                {softSkills.map(s => <span key={s}>· {s}</span>)}
              </div>
            </div>
          )}
        </div>
        <div>
          {sections.languages.visible && languages.length > 0 && (
            <div className="ex-section" style={{ marginBottom: '10px' }}>
              <div className="ex-section-title">Idiomas</div>
              {languages.map(lang => (
                <div key={lang.id} className="ex-lang">
                  <span>{lang.language}</span>
                  <span className="ex-lang-level">— {lang.level}</span>
                </div>
              ))}
            </div>
          )}
          {(sections.certifications.visible || sections.courses.visible) && (
            <div className="ex-section">
              <div className="ex-section-title">Certificações e Cursos</div>
              {sections.certifications.visible && certifications.map(c => (
                <div key={c.id} className="ex-cert">
                  · {c.name}{c.validity ? ` (até ${c.validity})` : ''}
                </div>
              ))}
              {sections.courses.visible && courses.map(c => (
                <div key={c.id} className="ex-cert">· {c.name}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
