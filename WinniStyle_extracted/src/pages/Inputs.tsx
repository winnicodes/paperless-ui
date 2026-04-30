import { User, Mail, Lock, Search, Eye, EyeOff, Save } from 'lucide-react'
import { useState } from 'react'

export default function Inputs() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <div className="page-header">
        <h1>Eingaben</h1>
        <p>Text-Inputs, Selects, Textareas, Checkboxen und vollständige Formular-Beispiele.</p>
      </div>

      <section className="section">
        <h2 className="section-title">Text Inputs</h2>
        <div className="grid grid-2">
          <div className="card">
            <div className="field">
              <label className="label" htmlFor="i-default">Standard</label>
              <input className="input" id="i-default" type="text" placeholder="Placeholder Text" />
            </div>
            <div className="field">
              <label className="label" htmlFor="i-icon">Mit Icon</label>
              <div className="input-group">
                <User className="input-icon" size={16} />
                <input className="input" id="i-icon" type="text" placeholder="Dein Name" />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="i-email">E-Mail</label>
              <div className="input-group">
                <Mail className="input-icon" size={16} />
                <input className="input" id="i-email" type="email" placeholder="name@beispiel.de" />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="i-pw">Passwort</label>
              <div className="input-group" style={{ position: 'relative' }}>
                <Lock className="input-icon" size={16} />
                <input className="input" id="i-pw" type={showPassword ? 'text' : 'password'} placeholder="••••••••" style={{ paddingRight: 'var(--space-10)' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(var(--np-text-muted))', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <span className="hint">Mindestens 8 Zeichen.</span>
            </div>
            <div className="field">
              <label className="label" htmlFor="i-search">Suche</label>
              <div className="input-group">
                <Search className="input-icon" size={16} />
                <input className="input" id="i-search" type="search" placeholder="Suchen..." />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="field">
              <label className="label" htmlFor="i-disabled">Deaktiviert</label>
              <input className="input" id="i-disabled" type="text" placeholder="Nicht editierbar" disabled />
            </div>
            <div className="field">
              <label className="label" htmlFor="i-select">Select / Dropdown</label>
              <select className="select" id="i-select">
                <option value="">Bitte wählen...</option>
                <option>Option A</option>
                <option>Option B</option>
                <option>Option C</option>
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="i-textarea">Textarea</label>
              <textarea className="textarea" id="i-textarea" rows={4} placeholder="Mehrzeilige Eingabe..." />
              <span className="hint">Maximal 500 Zeichen.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Vollständiges Formular</h2>
        <div className="card" style={{ maxWidth: '32rem' }}>
          <div className="card-header">
            <div>
              <div className="card-title">Profil bearbeiten</div>
              <div className="card-description">Persönliche Angaben aktualisieren</div>
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="f-name">Vollständiger Name</label>
            <div className="input-group">
              <User className="input-icon" size={16} />
              <input className="input" id="f-name" type="text" defaultValue="Winni Beispiel" />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="f-email">E-Mail-Adresse</label>
            <div className="input-group">
              <Mail className="input-icon" size={16} />
              <input className="input" id="f-email" type="email" defaultValue="winni@beispiel.de" />
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="f-role">Rolle</label>
            <select className="select" id="f-role" defaultValue="admin">
              <option value="admin">Administrator</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="field">
            <label className="label" htmlFor="f-bio">Über mich</label>
            <textarea className="textarea" id="f-bio" rows={3} defaultValue="Kurze Beschreibung..." />
          </div>
          <div className="flex gap-3" style={{ marginTop: 'var(--space-5)' }}>
            <button className="btn btn-primary"><Save size={14} /> Speichern</button>
            <button className="btn btn-ghost">Abbrechen</button>
          </div>
        </div>
      </section>
    </>
  )
}
