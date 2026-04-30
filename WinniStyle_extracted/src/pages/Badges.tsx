import { Check, Clock, X, Info, Sparkles, Star, Zap, Lock, Globe } from 'lucide-react'
import { CodeSnippet } from '../components/ui/CodeSnippet'

export default function Badges() {
  return (
    <>
      <div className="page-header">
        <h1>Badges</h1>
        <p>Status-Indikatoren, Tags und Labels in verschiedenen Varianten.</p>
      </div>

      <div className="comp-docs">
        <section className="section">
          <h2 className="section-title">Varianten</h2>
          <div className="doc-list">
            <article className="doc-row">
              <div className="doc-header">
                <h3>Farbvarianten</h3>
                <div className="doc-token-list">
                  <code>badge</code>
                  <code>badge-default</code>
                </div>
              </div>
              <div className="doc-preview">
                <div className="preview-cluster">
                  <span className="badge badge-default">Standard</span>
                  <span className="badge badge-secondary">Sekundär</span>
                  <span className="badge badge-success">Erfolg</span>
                  <span className="badge badge-warning">Warnung</span>
                  <span className="badge badge-danger">Fehler</span>
                  <span className="badge badge-info">Info</span>
                  <span className="badge badge-outline">Outline</span>
                </div>
              </div>
              <CodeSnippet code={`<span className="badge badge-default">Standard</span>
<span className="badge badge-success">Erfolg</span>
<span className="badge badge-warning">Warnung</span>
<span className="badge badge-danger">Fehler</span>
<span className="badge badge-outline">Outline</span>`} />
            </article>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Mit Icons</h2>
          <div className="doc-list">
            <article className="doc-row">
              <div className="doc-header">
                <h3>Icon + Label</h3>
                <div className="doc-token-list">
                  <code>badge</code>
                  <code>badge-default</code>
                </div>
              </div>
              <div className="doc-preview">
                <div className="preview-cluster">
                  <span className="badge badge-default"><Sparkles size={12} /> Neu</span>
                  <span className="badge badge-secondary"><Lock size={12} /> Gesperrt</span>
                  <span className="badge badge-success"><Check size={12} /> Aktiv</span>
                  <span className="badge badge-warning"><Clock size={12} /> Ausstehend</span>
                  <span className="badge badge-danger"><X size={12} /> Fehler</span>
                  <span className="badge badge-info"><Info size={12} /> Info</span>
                  <span className="badge badge-outline"><Globe size={12} /> Öffentlich</span>
                </div>
              </div>
              <CodeSnippet code={`<span className="badge badge-default"><Sparkles size={12} /> Neu</span>
<span className="badge badge-secondary"><Lock size={12} /> Gesperrt</span>
<span className="badge badge-success"><Check size={12} /> Aktiv</span>
<span className="badge badge-warning"><Clock size={12} /> Ausstehend</span>
<span className="badge badge-danger"><X size={12} /> Fehler</span>
<span className="badge badge-info"><Info size={12} /> Info</span>
<span className="badge badge-outline"><Globe size={12} /> Öffentlich</span>`} />
            </article>
          </div>
        </section>

        <section className="section">
          <h2 className="section-title">Anwendungsbeispiele</h2>
          <div className="doc-list">
            <article className="doc-row">
              <div className="doc-header">
                <h3>In Karten-Headern</h3>
                <div className="doc-token-list">
                  <code>card-header</code>
                  <code>card-title</code>
                  <code>badge</code>
                </div>
              </div>
              <div className="doc-preview" style={{ alignItems: 'flex-start' }}>
                <div className="grid grid-2" style={{ width: '100%' }}>
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">Projekt Alpha</div>
                      <span className="badge badge-success"><Check size={12} /> Aktiv</span>
                    </div>
                    <p style={{ color: 'rgb(var(--np-text-muted))', fontSize: 'var(--ds-font-size-sm)' }}>
                      Badges in Karten-Headern für Status-Anzeigen.
                    </p>
                    <div className="preview-cluster" style={{ marginTop: 'var(--space-3)' }}>
                      <span className="badge badge-outline"><Star size={12} /> Featured</span>
                      <span className="badge badge-outline"><Zap size={12} /> Beta</span>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">Release v2.0</div>
                      <span className="badge badge-warning"><Clock size={12} /> In Arbeit</span>
                    </div>
                    <p style={{ color: 'rgb(var(--np-text-muted))', fontSize: 'var(--ds-font-size-sm)' }}>
                      Mehrere Badges nebeneinander als Tag-System.
                    </p>
                    <div className="preview-cluster" style={{ marginTop: 'var(--space-3)' }}>
                      <span className="badge badge-secondary">React</span>
                      <span className="badge badge-secondary">TypeScript</span>
                      <span className="badge badge-secondary">Vite</span>
                    </div>
                  </div>
                </div>
              </div>
              <CodeSnippet code={`<div className="card-header">
  <div className="card-title">Projekt Alpha</div>
  <span className="badge badge-success">
    <Check size={12} />
    Aktiv
  </span>
</div>`} />
            </article>
          </div>
        </section>
      </div>
    </>
  )
}
