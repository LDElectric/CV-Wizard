import { normalizeEmail, normalizeExternalUrl, normalizePhone } from './linkUtils';

export default function ModeloPdf({ cv, formatDescription }) {
  const {
    personal,
    summary,
    education,
    experience,
    technicalSkills,
    softSkills,
    languages,
    interests,
    certifications,
    courses,
    sections,
    theme,
  } = cv;

  const trainingItems = [
    ...(sections.certifications.visible ? certifications.map((item) => ({ id: item.id, name: item.name, detail: [item.issuer, item.validity ? `Valido ate ${item.validity}` : ''].filter(Boolean).join(' - ') })) : []),
    ...(sections.courses.visible ? courses.map((item) => ({ id: item.id, name: item.name, detail: [item.institution, item.date].filter(Boolean).join(' - ') })) : []),
  ];

  return (
    <div className="cv-document cv-modelo-pdf" style={{ fontFamily: `'${theme.font}', sans-serif` }}>
      <header className="mp-top">
        <h1 className="mp-name">{personal.name}</h1>
        <p className="mp-title">{personal.title}</p>
      </header>

      <section className="mp-section">
        <h2 className="mp-heading">DADOS PESSOAIS</h2>
        {personal.address && <p>{personal.address}</p>}
        <p>
          {personal.email && <a href={normalizeEmail(personal.email)}>{personal.email}</a>}
          {personal.email && personal.phone ? ' , ' : ''}
          {personal.phone && <a href={normalizePhone(personal.phone)}>{personal.phone}</a>}
        </p>
        {personal.linkedin && <p>LinkedIn: <a href={normalizeExternalUrl(personal.linkedin)} target="_blank" rel="noreferrer">{personal.linkedin}</a></p>}
        {personal.github && <p>Github: <a href={normalizeExternalUrl(personal.github)} target="_blank" rel="noreferrer">{personal.github}</a></p>}
        {personal.instagram && <p>Instagram: <a href={normalizeExternalUrl(personal.instagram)} target="_blank" rel="noreferrer">{personal.instagram}</a></p>}
        {personal.website && <p>Website: <a href={normalizeExternalUrl(personal.website)} target="_blank" rel="noreferrer">{personal.website}</a></p>}
      </section>

      {sections.summary.visible && summary && (
        <section className="mp-section">
          <h2 className="mp-heading">RESUMO PROFISSIONAL</h2>
          <p className="mp-justify">{summary}</p>
        </section>
      )}

      {sections.education.visible && education.length > 0 && (
        <section className="mp-section">
          <h2 className="mp-heading">FORMAÇÃO</h2>
          {education.map((item) => (
            <div key={item.id} className="mp-item">
              <div className="mp-row">
                <strong>{item.role}</strong>
                <span>{item.date}</span>
              </div>
              <p>{item.org}{item.description ? `, ${item.description}` : ''}</p>
            </div>
          ))}
        </section>
      )}

      {sections.experience.visible && experience.length > 0 && (
        <section className="mp-section">
          <h2 className="mp-heading">EXPERIÊNCIA</h2>
          {experience.map((item) => (
            <div key={item.id} className="mp-item mp-item-large" data-print-exp-item="true">
              <div className="mp-row" data-print-exp-header="true">
                <strong>{item.role}</strong>
                <span>{item.date}</span>
              </div>
              <p>{item.org}{item.location ? `, ${item.location}` : ''}</p>
              <div className="mp-desc" data-print-exp-body="true">{formatDescription(item.description)}</div>
            </div>
          ))}
        </section>
      )}

      <section className="mp-section">
        <h2 className="mp-heading">COMPETÊNCIAS</h2>
        <div className="mp-skills-grid">
          <div>
            <h3>COMPETÊNCIAS PROFISSIONAIS</h3>
            {sections.technicalSkills.visible && technicalSkills.map((item) => <p key={item}>- {item}</p>)}
          </div>
          <div>
            <h3>COMPETÊNCIAS PESSOAIS</h3>
            {sections.softSkills.visible && softSkills.map((item) => <p key={item}>- {item}</p>)}
          </div>
        </div>
      </section>

      {sections.languages.visible && languages.length > 0 && (
        <section className="mp-section">
          <h2 className="mp-heading">IDIOMAS</h2>
          {languages.map((item) => (
            <p key={item.id}>{item.language} - {item.level}</p>
          ))}
        </section>
      )}

      {sections.interests.visible && interests && (
        <section className="mp-section">
          <h2 className="mp-heading">INTERESSES</h2>
          <p>{interests}</p>
        </section>
      )}

      {trainingItems.length > 0 && (
        <section className="mp-section">
          <h2 className="mp-heading">CURSOS</h2>
          {trainingItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="mp-item">
              <p><strong>{item.name}</strong></p>
              {item.detail && <p>{item.detail}</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
