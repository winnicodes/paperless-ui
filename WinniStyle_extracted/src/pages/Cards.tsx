import { ArrowRight, Check } from 'lucide-react'

export default function Cards() {
  return (
    <>
      <div className="page-header">
        <h1>Karten</h1>
        <p>Card-Varianten, Stat-Tiles und Skeleton Loader.</p>
      </div>

      <section className="section">
        <h2 className="section-title">Varianten</h2>
        <div className="grid grid-3">
          <div className="card">
            <div className="card-title">Standard</div>
            <div className="card-description">Border, kein Schatten</div>
            <p style={{ marginTop: 'var(--space-3)', color: 'rgb(var(--np-text-muted))', fontSize: 'var(--ds-font-size-sm)' }}>
              Für eingebettete Inhalte auf Hintergrund-Niveau.
            </p>
          </div>
          <div className="card-elevated">
            <div className="card-title">Elevated</div>
            <div className="card-description">Mit Schatten, subtile Border</div>
            <p style={{ marginTop: 'var(--space-3)', color: 'rgb(var(--np-text-muted))', fontSize: 'var(--ds-font-size-sm)' }}>
              Hebt sich sichtbar vom Hintergrund ab.
            </p>
          </div>
          <div className="stat-tile">
            <div className="card-title">Stat Tile</div>
            <div className="card-description">Für Kennzahlen</div>
            <p style={{ marginTop: 'var(--space-3)', color: 'rgb(var(--np-text-muted))', fontSize: 'var(--ds-font-size-sm)' }}>
              Innerer Schatten, optimiert für Zahlen.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Mit Header und Aktionen</h2>
        <div className="grid grid-2">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Projekt Alpha</div>
                <div className="card-description">Gestartet am 01.03.2025</div>
              </div>
              <span className="badge badge-success"><Check size={10} /> Aktiv</span>
            </div>
            <p style={{ color: 'rgb(var(--np-text-muted))', fontSize: 'var(--ds-font-size-sm)', marginBottom: 'var(--space-4)' }}>
              Placeholder-Beschreibung für dieses Projekt. Hier steht eine kurze Zusammenfassung.
            </p>
            <button className="btn btn-sm btn-secondary"><ArrowRight size={13} /> Details</button>
          </div>
          <div className="card-elevated">
            <div className="card-header">
              <div>
                <div className="card-title">Elevated mit Avatar</div>
                <div className="card-description">Nutzer-bezogene Karte</div>
              </div>
            </div>
            <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-4)' }}>
              <div className="avatar avatar-lg">AB</div>
              <div>
                <div style={{ fontWeight: 500 }}>Anna Beispiel</div>
                <div style={{ fontSize: 'var(--ds-font-size-xs)', color: 'rgb(var(--np-text-muted))' }}>Administrator</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-outline">Designer</span>
              <span className="badge badge-outline">Frontend</span>
              <span className="badge badge-outline">React</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Stat Tiles</h2>
        <div className="grid grid-4">
          {[
            { label: 'Projekte',  value: '24',  delta: '+3 Woche',  up: true },
            { label: 'Aufgaben', value: '142', delta: '8 offen',   up: false },
            { label: 'Team',     value: '7',   delta: 'Mitglieder',up: null },
            { label: 'Score',    value: '9.2', delta: '+0.4',      up: true },
          ].map(({ label, value, delta, up }) => (
            <div className="stat-tile" key={label}>
              <div className="stat-label">{label}</div>
              <div className="stat-value">{value}</div>
              <div className={`stat-delta${up === true ? ' up' : up === false ? ' down' : ''}`}>{delta}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Skeleton Loader</h2>
        <div className="grid grid-2">
          {[0, 1].map(i => (
            <div className="card" key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div className="flex items-center gap-3">
                <div className="skeleton" style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <div className="skeleton" style={{ height: '0.75rem', width: '50%' }} />
                  <div className="skeleton" style={{ height: '0.75rem', width: '35%' }} />
                </div>
              </div>
              <div className="skeleton" style={{ height: '0.75rem', width: '100%' }} />
              <div className="skeleton" style={{ height: '0.75rem', width: '85%' }} />
              <div className="skeleton" style={{ height: '0.75rem', width: '70%' }} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
