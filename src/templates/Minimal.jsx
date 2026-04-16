import { normalizeEmail, normalizeExternalUrl, normalizePhone } from './linkUtils';

export default function Minimal({ cv, formatDescription }) {
  const { personal, summary, experience, education, technicalSkills, softSkills, languages, certifications, courses, sections, theme } = cv;
  const contacts = [
    personal.email ? { label: personal.email, href: normalizeEmail(personal.email) } : null,
    personal.phone ? { label: personal.phone, href: normalizePhone(personal.phone) } : null,
    personal.address ? { label: personal.address, href: '' } : null,
    personal.linkedin ? { label: personal.linkedin, href: normalizeExternalUrl(personal.linkedin) } : null,
    personal.github ? { label: personal.github, href: normalizeExternalUrl(personal.github) } : null,
    personal.instagram ? { label: personal.instagram, href: normalizeExternalUrl(personal.instagram) } : null,
    personal.website ? { label: personal.website, href: normalizeExternalUrl(personal.website) } : null,
  ].filter(Boolean);

  return (
    <div className="cv-document cv-minimal" style={{ fontFamily: `'${theme.font}', Georgia, serif` }}>
      {/* HEADER */}
      <div className="mn-header">
        {personal.photo && <img src={personal.photo} alt="" className="mn-photo" />}
        <div className="mn-name">{personal.name}</div>
        <div className="mn-title">{personal.title}</div>
        <div className="mn-contact">
          {contacts.map((contact, idx) => (
            <span key={`${contact.label}-${idx}`}>
              {contact.href ? <a href={contact.href} target={contact.href.startsWith('http') ? '_blank' : undefined} rel={contact.href.startsWith('http') ? 'noreferrer' : undefined}>{contact.label}</a> : contact.label}
              {idx < contacts.length - 1 ? '  ·  ' : ''}
            </span>
          ))}
        </div>
      </div>

      <hr className="mn-rule" />

      {/* RESUMO */}
      {sections.summary.visible && summary && (
        <div className="mn-row">
          <div className="mn-label">Resumo</div>
          <p className="mn-content cl-paragraph">{summary}</p>
        </div>
      )}

      {/* EXPERIÊNCIA */}
      {sections.experience.visible && experience.length > 0 && (
        <div>
          <div className="mn-section-title">Experiência</div>
          {experience.map(exp => (
            <div className="mn-row" key={exp.id} data-print-exp-item="true">
              <div className="mn-label">
                <div className="mn-date">{exp.date}</div>
                {exp.location && <div className="mn-sub">{exp.location}</div>}
              </div>
              <div className="mn-content">
                <div data-print-exp-header="true">
                  <div className="mn-org">{exp.org}</div>
                  {exp.role && <div className="mn-role">{exp.role}</div>}
                </div>
                <div className="cl-desc" style={{ marginTop: '4px' }} data-print-exp-body="true">{formatDescription(exp.description)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORMAÇÃO */}
      {sections.education.visible && education.length > 0 && (
        <div>
          <div className="mn-section-title">Formação</div>
          {education.map(edu => (
            <div className="mn-row" key={edu.id}>
              <div className="mn-label">
                <div className="mn-date">{edu.date}</div>
              </div>
              <div className="mn-content">
                <div className="mn-org">{edu.org}</div>
                {edu.role && <div className="mn-role">{edu.role}</div>}
                {edu.description && <div className="mn-sub">{edu.description}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPETÊNCIAS */}
      {(sections.technicalSkills.visible || sections.softSkills.visible) && (
        <div>
          <div className="mn-section-title">Competências</div>
          {sections.technicalSkills.visible && technicalSkills.length > 0 && (
            <div className="mn-row">
              <div className="mn-label">Técnicas</div>
              <div className="mn-content mn-inline-list">{technicalSkills.join('  ·  ')}</div>
            </div>
          )}
          {sections.softSkills.visible && softSkills.length > 0 && (
            <div className="mn-row">
              <div className="mn-label">Pessoais</div>
              <div className="mn-content mn-inline-list">{softSkills.join('  ·  ')}</div>
            </div>
          )}
        </div>
      )}

      {/* IDIOMAS */}
      {sections.languages.visible && languages.length > 0 && (
        <div>
          <div className="mn-section-title">Idiomas</div>
          <div className="mn-row">
            <div className="mn-label" />
            <div className="mn-content mn-inline-list">
              {languages.map(l => `${l.language} — ${l.level}`).join('  ·  ')}
            </div>
          </div>
        </div>
      )}

      {/* CERTIFICAÇÕES E CURSOS */}
      {(sections.certifications.visible || sections.courses.visible) && (
        <div>
          <div className="mn-section-title">Certificações e Cursos</div>
          <div className="mn-row">
            <div className="mn-label" />
            <div className="mn-content">
              {sections.certifications.visible && certifications.map(c => (
                <div key={c.id} className="mn-cert">
                  {c.name}{c.validity ? ` (até ${c.validity})` : ''}
                </div>
              ))}
              {sections.courses.visible && courses.map(c => (
                <div key={c.id} className="mn-cert">{c.name}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
