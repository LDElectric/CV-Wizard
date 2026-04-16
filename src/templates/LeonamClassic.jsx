import { normalizeEmail, normalizeExternalUrl, normalizePhone } from './linkUtils';

export default function LeonamClassic({ cv, formatDescription }) {
  const { personal, summary, experience, education, technicalSkills, softSkills, languages, certifications, courses, interests, sections, theme } = cv;
  const allCerts = sections.certifications.visible ? certifications : [];
  const allCourses = sections.courses.visible ? courses : [];
  const certCourseItems = [...allCerts.map(c => ({
    name: c.name,
    detail: [c.issuer, c.validity ? `Válido até ${c.validity}` : ''].filter(Boolean).join(' · '),
  })), ...allCourses.map(c => ({
    name: c.name,
    detail: [c.institution, c.date].filter(Boolean).join(' · '),
  }))];

  return (
    <div className="cv-document cv-classic" style={{ fontFamily: `'${theme.font}', sans-serif` }}>
      {/* HEADER */}
      <div className="cl-header">
        {personal.photo && <img src={personal.photo} alt="" className="cl-header-photo" />}
        <div>
          <div className="cl-name">{personal.name}</div>
          <div className="cl-title">{personal.title}</div>
        </div>
        <div className="cl-rule" />
        <div className="cl-contact">
          {personal.email    && <span>✉ <a href={normalizeEmail(personal.email)}>{personal.email}</a></span>}
          {personal.phone    && <span>✆ <a href={normalizePhone(personal.phone)}>{personal.phone}</a></span>}
          {personal.address  && <span>⊙ {personal.address}</span>}
          {personal.linkedin && <span>in <a href={normalizeExternalUrl(personal.linkedin)} target="_blank" rel="noreferrer">{personal.linkedin}</a></span>}
          {personal.github   && <span>⌥ <a href={normalizeExternalUrl(personal.github)} target="_blank" rel="noreferrer">{personal.github}</a></span>}
          {personal.instagram && <span>◎ <a href={normalizeExternalUrl(personal.instagram)} target="_blank" rel="noreferrer">{personal.instagram}</a></span>}
          {personal.website  && <span>🌐 <a href={normalizeExternalUrl(personal.website)} target="_blank" rel="noreferrer">{personal.website}</a></span>}
        </div>
      </div>

      {/* RESUMO */}
      {sections.summary.visible && summary && (
        <div className="cl-section">
          <div className="cl-section-title">Resumo Profissional</div>
          <p className="cl-paragraph">{summary}</p>
        </div>
      )}

      {/* EXPERIÊNCIA */}
      {sections.experience.visible && experience.length > 0 && (
        <div className="cl-section">
          <div className="cl-section-title">Experiência Profissional</div>
          {experience.map(exp => (
            <div className="cl-item" key={exp.id} data-print-exp-item="true">
              <div className="cl-item-row" data-print-exp-header="true">
                <div>
                  <span className="cl-org">{exp.org}</span>
                  {exp.role && <span className="cl-role"> · {exp.role}</span>}
                </div>
                <span className="cl-date">{exp.date}</span>
              </div>
              {exp.location && <div className="cl-location">{exp.location}</div>}
              <div className="cl-desc" data-print-exp-body="true">{formatDescription(exp.description)}</div>
            </div>
          ))}
        </div>
      )}

      {/* FORMAÇÃO */}
      {sections.education.visible && education.length > 0 && (
        <div className="cl-section">
          <div className="cl-section-title">Formação Acadêmica</div>
          {education.map(edu => (
            <div className="cl-item" key={edu.id}>
              <div className="cl-item-row">
                <div>
                  <span className="cl-org">{edu.org}</span>
                  {edu.role && <span className="cl-role"> · {edu.role}</span>}
                </div>
                <span className="cl-date">{edu.date}</span>
              </div>
              {edu.description && <div className="cl-location">{edu.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* 2-COLUMN: COMPETÊNCIAS + IDIOMAS */}
      {(sections.technicalSkills.visible || sections.softSkills.visible || sections.languages.visible) && (
        <div className="cl-two-col">
          <div style={{ flex: '3' }}>
            {sections.technicalSkills.visible && technicalSkills.length > 0 && (
              <div className="cl-section" style={{ marginBottom: 0 }}>
                <div className="cl-section-title">Competências Técnicas</div>
                <div className="cl-badges">
                  {technicalSkills.map(s => <span key={s} className="cl-badge">{s}</span>)}
                </div>
              </div>
            )}
            {sections.softSkills.visible && softSkills.length > 0 && (
              <div className="cl-section" style={{ marginTop: '10px', marginBottom: 0 }}>
                <div className="cl-section-title">Competências Pessoais</div>
                <div className="cl-badges">
                  {softSkills.map(s => <span key={s} className="cl-badge cl-badge-soft">{s}</span>)}
                </div>
              </div>
            )}
          </div>
          {sections.languages.visible && languages.length > 0 && (
            <div style={{ flex: '2' }}>
              <div className="cl-section" style={{ marginBottom: 0 }}>
                <div className="cl-section-title">Idiomas</div>
                {languages.map(lang => (
                  <div key={lang.id} className="cl-lang">
                    <span className="cl-lang-name">{lang.language}</span>
                    <span className="cl-lang-level">{lang.level}</span>
                    <div className="cl-dots">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} className={`cl-dot ${i <= lang.levelNum ? 'active' : ''}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CERTIFICAÇÕES E CURSOS */}
      {certCourseItems.length > 0 && (
        <div className="cl-section">
          <div className="cl-section-title">Certificações e Cursos</div>
          {certCourseItems.map((item, i) => (
            <div key={i} className="cl-cert">
              <span className="cl-cert-name">{item.name}</span>
              {item.detail && <span className="cl-cert-detail"> · {item.detail}</span>}
            </div>
          ))}
        </div>
      )}

      {/* INTERESSES */}
      {sections.interests.visible && interests && (
        <div className="cl-section">
          <div className="cl-section-title">Interesses</div>
          <p className="cl-paragraph">{interests}</p>
        </div>
      )}
    </div>
  );
}
