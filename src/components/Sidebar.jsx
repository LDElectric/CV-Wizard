import { useRef, useState } from 'react';
import { TEMPLATES, COLORS, FONTS, LANGUAGE_LEVELS, LEVEL_TO_NUM } from '../data';

function AccSection({ id, title, icon, open, onToggle, children }) {
  return (
    <div className="acc-section">
      <button className={`acc-header ${open ? 'open' : ''}`} onClick={() => onToggle(id)}>
        <span className="acc-icon">{icon}</span>
        <span className="acc-title">{title}</span>
        <span className="acc-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="acc-body">{children}</div>}
    </div>
  );
}

function TagInput({ tags, onAdd, onRemove, placeholder }) {
  const [val, setVal] = useState('');
  const commit = () => {
    const t = val.trim().replace(/,$/, '');
    if (t && !tags.includes(t)) onAdd(t);
    setVal('');
  };
  return (
    <div className="tag-wrap">
      <div className="tag-list">
        {tags.map(t => (
          <span key={t} className="tag-chip">
            {t}
            <button className="tag-x" onClick={() => onRemove(t)}>×</button>
          </span>
        ))}
      </div>
      <div className="tag-input-row">
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commit(); } }}
          placeholder={placeholder}
        />
        <button className="btn btn-sm btn-secondary" onClick={commit}>+</button>
      </div>
    </div>
  );
}

export default function Sidebar({ cv, updatePersonal, updateTheme, updateField, addItem, removeItem, updateItem, toggleSection, onImportCv, importStatus }) {
  const [open, setOpen] = useState(new Set(['import', 'appearance', 'personal']));
  const importInputRef = useRef(null);

  const toggle = (id) => setOpen(prev => {
    const s = new Set(prev);
    s.has(id) ? s.delete(id) : s.add(id);
    return s;
  });

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => updatePersonal('photo', ev.target.result);
    reader.readAsDataURL(file);
  };

  const addTag = (field, tag) => {
    if (!cv[field].includes(tag)) updateField(field, [...cv[field], tag]);
  };
  const removeTag = (field, tag) => updateField(field, cv[field].filter(t => t !== tag));

  const sec = (id) => open.has(id);

  const openImportPicker = () => {
    importInputRef.current?.click();
  };

  const handleImportChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onImportCv(file);
    e.target.value = '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>CV Wizard PRO</h1>
        <p>Construa seu currículo profissional</p>
      </div>

      <div className="sidebar-content">

        {/* ── IMPORTAR CURRÍCULO ── */}
        <AccSection id="import" title="Importar Currículo" icon="📥" open={sec('import')} onToggle={toggle}>
          <p className="hint">
            Faça upload de PDF, DOCX ou TXT. O wizard tenta preencher os campos automaticamente para você editar.
          </p>

          <input
            ref={importInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            style={{ display: 'none' }}
            onChange={handleImportChange}
          />

          <button className="btn btn-secondary" onClick={openImportPicker}>
            Carregar currículo existente
          </button>

          {importStatus?.message && (
            <div className={`import-status import-${importStatus.type || 'info'}`}>
              {importStatus.message}
            </div>
          )}
        </AccSection>

        {/* ── APARÊNCIA ── */}
        <AccSection id="appearance" title="Aparência e Modelo" icon="🎨" open={sec('appearance')} onToggle={toggle}>
          <div className="template-grid">
            {TEMPLATES.map(tpl => (
              <div
                key={tpl.id}
                className={`tpl-card ${cv.theme.template === tpl.id ? 'active' : ''}`}
                onClick={() => updateTheme('template', tpl.id)}
              >
                <div className="tpl-card-name">{tpl.name}</div>
                <div className="tpl-card-desc">{tpl.description}</div>
              </div>
            ))}
          </div>

          <div className="form-group" style={{ marginTop: '16px' }}>
            <label>Cor de Destaque</label>
            <div className="color-row">
              {COLORS.map(c => (
                <div
                  key={c.value}
                  className={`color-dot ${cv.theme.color === c.value ? 'active' : ''}`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                  onClick={() => updateTheme('color', c.value)}
                />
              ))}
              <input
                type="color" value={cv.theme.color}
                onChange={e => updateTheme('color', e.target.value)}
                className="color-custom" title="Cor personalizada"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Fonte</label>
            <select value={cv.theme.font} onChange={e => updateTheme('font', e.target.value)}>
              {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={cv.theme.bulletPoints} onChange={e => updateTheme('bulletPoints', e.target.checked)} />
            Usar marcadores (bullets) nas descrições
          </label>
        </AccSection>

        {/* ── DADOS PESSOAIS ── */}
        <AccSection id="personal" title="Dados Pessoais" icon="👤" open={sec('personal')} onToggle={toggle}>
          <div className="form-group">
            <label>Nome Completo</label>
            <input value={cv.personal.name} onChange={e => updatePersonal('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Título Profissional</label>
            <input value={cv.personal.title} onChange={e => updatePersonal('title', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={cv.personal.email} onChange={e => updatePersonal('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input value={cv.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Endereço / Cidade</label>
            <input value={cv.personal.address} onChange={e => updatePersonal('address', e.target.value)} />
          </div>
          <div className="form-group">
            <label>LinkedIn</label>
            <input value={cv.personal.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>GitHub</label>
              <input value={cv.personal.github} onChange={e => updatePersonal('github', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Instagram</label>
              <input value={cv.personal.instagram} onChange={e => updatePersonal('instagram', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Website</label>
            <input value={cv.personal.website} onChange={e => updatePersonal('website', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Foto de Perfil (opcional)</label>
            <input type="file" accept="image/*" onChange={handlePhoto} />
            {cv.personal.photo && (
              <div className="photo-preview">
                <img src={cv.personal.photo} alt="" />
                <button className="btn btn-sm btn-danger" onClick={() => updatePersonal('photo', null)}>Remover foto</button>
              </div>
            )}
          </div>
        </AccSection>

        {/* ── RESUMO ── */}
        <AccSection id="summary" title="Resumo Profissional" icon="📝" open={sec('summary')} onToggle={toggle}>
          <textarea
            value={cv.summary}
            onChange={e => updateField('summary', e.target.value)}
            rows={6}
            placeholder="Descreva sua trajetória, habilidades e objetivos..."
          />
          <p className="hint">Dica: seja objetivo, destaque conquistas e diferenciais.</p>
        </AccSection>

        {/* ── EXPERIÊNCIA ── */}
        <AccSection id="experience" title="Experiência Profissional" icon="💼" open={sec('experience')} onToggle={toggle}>
          <button className="btn btn-secondary btn-sm" style={{ marginBottom: '12px' }} onClick={() => addItem('experience')}>
            + Adicionar Experiência
          </button>
          {cv.experience.map((exp, i) => (
            <div className="item-card" key={exp.id}>
              <div className="item-card-top">
                <strong>{exp.org || `Experiência ${i + 1}`}</strong>
                <button className="btn btn-sm btn-danger" onClick={() => removeItem('experience', exp.id)}>Remover</button>
              </div>
              <div className="form-group">
                <label>Empresa</label>
                <input value={exp.org} onChange={e => updateItem('experience', exp.id, 'org', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Cargo / Função</label>
                <input value={exp.role} onChange={e => updateItem('experience', exp.id, 'role', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Período</label>
                  <input value={exp.date} onChange={e => updateItem('experience', exp.id, 'date', e.target.value)} placeholder="jan 2020 – Atual" />
                </div>
                <div className="form-group">
                  <label>Local</label>
                  <input value={exp.location} onChange={e => updateItem('experience', exp.id, 'location', e.target.value)} placeholder="Cidade, UF" />
                </div>
              </div>
              <div className="form-group">
                <label>Atividades (uma por linha → gera bullets)</label>
                <textarea rows={4} value={exp.description} onChange={e => updateItem('experience', exp.id, 'description', e.target.value)} />
              </div>
            </div>
          ))}
        </AccSection>

        {/* ── FORMAÇÃO ── */}
        <AccSection id="education" title="Formação Acadêmica" icon="🎓" open={sec('education')} onToggle={toggle}>
          <button className="btn btn-secondary btn-sm" style={{ marginBottom: '12px' }} onClick={() => addItem('education')}>
            + Adicionar Formação
          </button>
          {cv.education.map((edu, i) => (
            <div className="item-card" key={edu.id}>
              <div className="item-card-top">
                <strong>{edu.org || `Formação ${i + 1}`}</strong>
                <button className="btn btn-sm btn-danger" onClick={() => removeItem('education', edu.id)}>Remover</button>
              </div>
              <div className="form-group">
                <label>Instituição</label>
                <input value={edu.org} onChange={e => updateItem('education', edu.id, 'org', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Curso / Grau</label>
                <input value={edu.role} onChange={e => updateItem('education', edu.id, 'role', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Período</label>
                  <input value={edu.date} onChange={e => updateItem('education', edu.id, 'date', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Obs / Local</label>
                  <input value={edu.description} onChange={e => updateItem('education', edu.id, 'description', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </AccSection>

        {/* ── COMPETÊNCIAS TÉCNICAS ── */}
        <AccSection id="techSkills" title="Competências Técnicas" icon="🛠️" open={sec('techSkills')} onToggle={toggle}>
          <TagInput
            tags={cv.technicalSkills}
            onAdd={tag => addTag('technicalSkills', tag)}
            onRemove={tag => removeTag('technicalSkills', tag)}
            placeholder="Ex: Python, AutoCAD, NR-10…"
          />
        </AccSection>

        {/* ── COMPETÊNCIAS PESSOAIS ── */}
        <AccSection id="softSkills" title="Competências Pessoais" icon="🌟" open={sec('softSkills')} onToggle={toggle}>
          <TagInput
            tags={cv.softSkills}
            onAdd={tag => addTag('softSkills', tag)}
            onRemove={tag => removeTag('softSkills', tag)}
            placeholder="Ex: Liderança, Proatividade…"
          />
        </AccSection>

        {/* ── IDIOMAS ── */}
        <AccSection id="languages" title="Idiomas" icon="🌍" open={sec('languages')} onToggle={toggle}>
          <button className="btn btn-secondary btn-sm" style={{ marginBottom: '10px' }} onClick={() => addItem('languages')}>
            + Adicionar Idioma
          </button>
          {cv.languages.map(lang => (
            <div className="item-card item-card-compact" key={lang.id}>
              <div className="form-row" style={{ alignItems: 'flex-end' }}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Idioma</label>
                  <input value={lang.language} onChange={e => updateItem('languages', lang.id, 'language', e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 3 }}>
                  <label>Nível</label>
                  <select value={lang.level} onChange={e => {
                    updateItem('languages', lang.id, 'level', e.target.value);
                    updateItem('languages', lang.id, 'levelNum', LEVEL_TO_NUM[e.target.value] || 3);
                  }}>
                    {LANGUAGE_LEVELS.map(lv => <option key={lv} value={lv}>{lv}</option>)}
                  </select>
                </div>
                <button className="btn btn-sm btn-danger" style={{ flexShrink: 0, marginBottom: '1px' }}
                  onClick={() => removeItem('languages', lang.id)}>×</button>
              </div>
            </div>
          ))}
        </AccSection>

        {/* ── CERTIFICAÇÕES ── */}
        <AccSection id="certifications" title="Certificações" icon="📜" open={sec('certifications')} onToggle={toggle}>
          <button className="btn btn-secondary btn-sm" style={{ marginBottom: '10px' }} onClick={() => addItem('certifications')}>
            + Adicionar Certificação
          </button>
          {cv.certifications.map(cert => (
            <div className="item-card item-card-compact" key={cert.id}>
              <div className="item-card-top">
                <strong style={{ fontSize: '0.8rem' }}>{cert.name || 'Nova certificação'}</strong>
                <button className="btn btn-sm btn-danger" onClick={() => removeItem('certifications', cert.id)}>×</button>
              </div>
              <div className="form-group">
                <label>Nome da Certificação</label>
                <input value={cert.name} onChange={e => updateItem('certifications', cert.id, 'name', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Emissor</label>
                  <input value={cert.issuer} onChange={e => updateItem('certifications', cert.id, 'issuer', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Validade</label>
                  <input value={cert.validity} onChange={e => updateItem('certifications', cert.id, 'validity', e.target.value)} placeholder="2028" />
                </div>
              </div>
            </div>
          ))}
        </AccSection>

        {/* ── CURSOS ── */}
        <AccSection id="courses" title="Cursos e Treinamentos" icon="📚" open={sec('courses')} onToggle={toggle}>
          <button className="btn btn-secondary btn-sm" style={{ marginBottom: '10px' }} onClick={() => addItem('courses')}>
            + Adicionar Curso
          </button>
          {cv.courses.map(course => (
            <div className="item-card item-card-compact" key={course.id}>
              <div className="item-card-top">
                <strong style={{ fontSize: '0.8rem' }}>{course.name || 'Novo curso'}</strong>
                <button className="btn btn-sm btn-danger" onClick={() => removeItem('courses', course.id)}>×</button>
              </div>
              <div className="form-group">
                <label>Nome do Curso</label>
                <input value={course.name} onChange={e => updateItem('courses', course.id, 'name', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Instituição</label>
                  <input value={course.institution} onChange={e => updateItem('courses', course.id, 'institution', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Ano</label>
                  <input value={course.date} onChange={e => updateItem('courses', course.id, 'date', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </AccSection>

        {/* ── INTERESSES ── */}
        <AccSection id="interests" title="Interesses" icon="❤️" open={sec('interests')} onToggle={toggle}>
          <textarea
            value={cv.interests}
            onChange={e => updateField('interests', e.target.value)}
            rows={3}
            placeholder="Ex: Análise de dados, PCM, automação industrial…"
          />
        </AccSection>

        {/* ── VISIBILIDADE DE SEÇÕES ── */}
        <AccSection id="visibility" title="Visibilidade de Seções" icon="👁️" open={sec('visibility')} onToggle={toggle}>
          <p className="hint" style={{ marginBottom: '10px' }}>Ative ou desative seções no currículo:</p>
          {Object.entries(cv.sections).map(([key, sec]) => (
            <label key={key} className="toggle-row">
              <span>{sec.label}</span>
              <input
                type="checkbox"
                checked={sec.visible}
                onChange={() => toggleSection(key)}
              />
            </label>
          ))}
        </AccSection>

      </div>
    </div>
  );
}
