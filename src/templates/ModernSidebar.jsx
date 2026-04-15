import { normalizeEmail, normalizeExternalUrl, normalizePhone } from './linkUtils';

export default function ModernSidebar({ cv, formatDescription }) {
  const { personal, summary, experience, education, technicalSkills, softSkills, languages, certifications, courses, sections, theme } = cv;

  const initials = personal.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="cv-document cv-sidebar" style={{ fontFamily: `'${theme.font}', sans-serif` }}>
      {/* LEFT SIDEBAR */}
      <aside className="sb-aside" style={{ backgroundColor: 'var(--cv-accent)' }}>
        {personal.photo ? (
          <img src={personal.photo} alt="" className="sb-photo" />
        ) : (
          <div className="sb-initials">{initials}</div>
        )}
        <div className="sb-name">{personal.name}</div>
        <div className="sb-title">{personal.title}</div>

        <div className="sb-divider" />

        <div className="sb-section">
          <div className="sb-section-label">Contato</div>
          {personal.email    && <div className="sb-contact-item">✉ <a href={normalizeEmail(personal.email)}>{personal.email}</a></div>}
          {personal.phone    && <div className="sb-contact-item">✆ <a href={normalizePhone(personal.phone)}>{personal.phone}</a></div>}
          {personal.address  && <div className="sb-contact-item">⊙ {personal.address}</div>}
          {personal.linkedin && <div className="sb-contact-item">in <a href={normalizeExternalUrl(personal.linkedin)} target="_blank" rel="noreferrer">{personal.linkedin}</a></div>}
          {personal.github   && <div className="sb-contact-item">⌥ <a href={normalizeExternalUrl(personal.github)} target="_blank" rel="noreferrer">{personal.github}</a></div>}
          {personal.instagram && <div className="sb-contact-item">◎ <a href={normalizeExternalUrl(personal.instagram)} target="_blank" rel="noreferrer">{personal.instagram}</a></div>}
          {personal.website  && <div className="sb-contact-item">🌐 <a href={normalizeExternalUrl(personal.website)} target="_blank" rel="noreferrer">{personal.website}</a></div>}
        </div>

        {sections.technicalSkills.visible && technicalSkills.length > 0 && (
          <div className="sb-section">
            <div className="sb-section-label">Competências</div>
            <div className="sb-skills">
              {technicalSkills.map(s => <span key={s} className="sb-skill">{s}</span>)}
            </div>
            {sections.softSkills.visible && softSkills.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                {softSkills.map(s => <span key={s} className="sb-skill sb-skill-soft">{s}</span>)}
              </div>
            )}
          </div>
        )}

        {sections.languages.visible && languages.length > 0 && (
          <div className="sb-section">
            <div className="sb-section-label">Idiomas</div>
            {languages.map(lang => (
              <div key={lang.id} className="sb-lang">
                <span>{lang.language}</span>
                <span className="sb-lang-level">{lang.level}</span>
                <div className="sb-lang-bar">
                  <div className="sb-lang-fill" style={{ width: `${(lang.levelNum / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {sections.certifications.visible && certifications.length > 0 && (
          <div className="sb-section">
            <div className="sb-section-label">Certificações</div>
            {certifications.map(c => (
              <div key={c.id} className="sb-cert-item">
                <span>· {c.name}</span>
                {c.validity && <span className="sb-cert-val">até {c.validity}</span>}
              </div>
            ))}
          </div>
        )}

        {sections.courses.visible && courses.length > 0 && (
          <div className="sb-section">
            <div className="sb-section-label">Cursos</div>
            {courses.map(c => (
              <div key={c.id} className="sb-cert-item">· {c.name}</div>
            ))}
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className="sb-main">
        {sections.summary.visible && summary && (
          <div className="sb-main-section">
            <div className="sb-main-title">Resumo Profissional</div>
            <p className="cl-paragraph">{summary}</p>
          </div>
        )}

        {sections.experience.visible && experience.length > 0 && (
          <div className="sb-main-section">
            <div className="sb-main-title">Experiência Profissional</div>
            {experience.map(exp => (
              <div className="sb-exp-item" key={exp.id}>
                <div className="sb-exp-row">
                  <div>
                    <span className="sb-exp-org">{exp.org}</span>
                    {exp.role && <div className="sb-exp-role">{exp.role}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="sb-exp-date">{exp.date}</span>
                    {exp.location && <div className="sb-exp-loc">{exp.location}</div>}
                  </div>
                </div>
                <div className="cl-desc">{formatDescription(exp.description)}</div>
              </div>
            ))}
          </div>
        )}

        {sections.education.visible && education.length > 0 && (
          <div className="sb-main-section">
            <div className="sb-main-title">Formação Acadêmica</div>
            {education.map(edu => (
              <div className="sb-exp-item" key={edu.id}>
                <div className="sb-exp-row">
                  <div>
                    <span className="sb-exp-org">{edu.org}</span>
                    {edu.role && <div className="sb-exp-role">{edu.role}</div>}
                    {edu.description && <div className="sb-exp-loc">{edu.description}</div>}
                  </div>
                  <span className="sb-exp-date">{edu.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
