import { normalizeEmail, normalizeExternalUrl, normalizePhone } from './linkUtils';

export default function Creative({ cv, formatDescription }) {
  const { personal, summary, experience, education, technicalSkills, softSkills, languages, certifications, courses, sections, theme } = cv;

  return (
    <div className="cv-document cv-creative" style={{ fontFamily: `'${theme.font}', sans-serif` }}>
      {/* HERO HEADER */}
      <div className="cr-header" style={{ backgroundColor: 'var(--cv-accent)' }}>
        {personal.photo && <img src={personal.photo} alt="" className="cr-photo" />}
        <div className="cr-name">{personal.name}</div>
        <div className="cr-title">{personal.title}</div>
        <div className="cr-contact">
          {personal.email    && <span>✉ <a href={normalizeEmail(personal.email)}>{personal.email}</a></span>}
          {personal.phone    && <span>✆ <a href={normalizePhone(personal.phone)}>{personal.phone}</a></span>}
          {personal.address  && <span>⊙ {personal.address}</span>}
          {personal.linkedin && <span>in <a href={normalizeExternalUrl(personal.linkedin)} target="_blank" rel="noreferrer">{personal.linkedin}</a></span>}
          {personal.github   && <span>⌥ <a href={normalizeExternalUrl(personal.github)} target="_blank" rel="noreferrer">{personal.github}</a></span>}
          {personal.instagram && <span>◎ <a href={normalizeExternalUrl(personal.instagram)} target="_blank" rel="noreferrer">{personal.instagram}</a></span>}
          {personal.website  && <span>🌐 <a href={normalizeExternalUrl(personal.website)} target="_blank" rel="noreferrer">{personal.website}</a></span>}
        </div>
      </div>

      <div className="cr-body">
        {/* RESUMO */}
        {sections.summary.visible && summary && (
          <div className="cr-section">
            <div className="cr-badge" style={{ backgroundColor: 'var(--cv-accent)' }}>Resumo</div>
            <p className="cl-paragraph">{summary}</p>
          </div>
        )}

        {/* EXPERIÊNCIA */}
        {sections.experience.visible && experience.length > 0 && (
          <div className="cr-section">
            <div className="cr-badge" style={{ backgroundColor: 'var(--cv-accent)' }}>Experiência</div>
            {experience.map(exp => (
              <div className="cr-card" key={exp.id} style={{ borderLeftColor: 'var(--cv-accent)' }}>
                <div className="cr-card-row">
                  <div>
                    <span className="cr-org">{exp.org}</span>
                    {exp.role && <div className="cr-role">{exp.role}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="cr-date">{exp.date}</span>
                    {exp.location && <div className="cr-loc">{exp.location}</div>}
                  </div>
                </div>
                <div className="cl-desc">{formatDescription(exp.description)}</div>
              </div>
            ))}
          </div>
        )}

        {/* FORMAÇÃO */}
        {sections.education.visible && education.length > 0 && (
          <div className="cr-section">
            <div className="cr-badge" style={{ backgroundColor: 'var(--cv-accent)' }}>Formação</div>
            {education.map(edu => (
              <div className="cr-card" key={edu.id} style={{ borderLeftColor: 'var(--cv-accent)' }}>
                <div className="cr-card-row">
                  <div>
                    <span className="cr-org">{edu.org}</span>
                    {edu.role && <div className="cr-role">{edu.role}</div>}
                    {edu.description && <div className="cr-loc">{edu.description}</div>}
                  </div>
                  <span className="cr-date">{edu.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMPETÊNCIAS */}
        {(sections.technicalSkills.visible || sections.softSkills.visible) && (
          <div className="cr-section">
            <div className="cr-badge" style={{ backgroundColor: 'var(--cv-accent)' }}>Competências</div>
            {sections.technicalSkills.visible && (
              <div className="cr-chips">
                {technicalSkills.map(s => <span key={s} className="cr-chip" style={{ borderColor: 'var(--cv-accent)', color: 'var(--cv-accent)' }}>{s}</span>)}
              </div>
            )}
            {sections.softSkills.visible && softSkills.length > 0 && (
              <div className="cr-chips" style={{ marginTop: '6px' }}>
                {softSkills.map(s => <span key={s} className="cr-chip cr-chip-soft">{s}</span>)}
              </div>
            )}
          </div>
        )}

        {/* IDIOMAS + CERTS em 2 colunas */}
        {(sections.languages.visible || sections.certifications.visible || sections.courses.visible) && (
          <div className="cr-two-col">
            {sections.languages.visible && languages.length > 0 && (
              <div className="cr-section">
                <div className="cr-badge" style={{ backgroundColor: 'var(--cv-accent)' }}>Idiomas</div>
                {languages.map(lang => (
                  <div key={lang.id} className="cr-lang-item">
                    <span>{lang.language}</span>
                    <span className="cr-lang-level">{lang.level}</span>
                    <div className="cr-lang-bar">
                      <div className="cr-lang-fill" style={{ width: `${(lang.levelNum / 5) * 100}%`, backgroundColor: 'var(--cv-accent)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {(sections.certifications.visible || sections.courses.visible) && (
              <div className="cr-section">
                <div className="cr-badge" style={{ backgroundColor: 'var(--cv-accent)' }}>Certificações</div>
                {sections.certifications.visible && certifications.map(c => (
                  <div key={c.id} className="cr-cert">
                    <span>· {c.name}</span>
                    {c.validity && <span className="cr-cert-val"> (até {c.validity})</span>}
                  </div>
                ))}
                {sections.courses.visible && courses.map(c => (
                  <div key={c.id} className="cr-cert">· {c.name}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
