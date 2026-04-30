export default function Progress() {
  const bars = [
    { label: 'Phase 1 — Abgeschlossen', pct: 100, variant: 'success' },
    { label: 'Phase 2 — In Arbeit',     pct: 68,  variant: '' },
    { label: 'Phase 3 — Kritisch',      pct: 12,  variant: 'danger' },
    { label: 'Phase 4 — Geplant',       pct: 0,   variant: '' },
  ]

  return (
    <>
      <div className="page-header">
        <h1>Progress</h1>
        <p>Fortschrittsbalken in verschiedenen Varianten und Zuständen.</p>
      </div>

      <section className="section">
        <h2 className="section-title">Varianten</h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {bars.map(({ label, pct, variant }) => (
            <div key={label}>
              <div className="flex justify-between" style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--ds-font-size-sm)' }}>
                <span>{label}</span>
                <span style={{ color: 'rgb(var(--np-text-muted))', fontWeight: 500 }}>{pct}%</span>
              </div>
              <div className="progress">
                <div className={`progress-bar${variant ? ` ${variant}` : ''}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Größen</h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--ds-font-size-xs)', color: 'rgb(var(--np-text-muted))', marginBottom: 'var(--space-2)' }}>Klein (4px)</div>
            <div className="progress" style={{ height: 4 }}>
              <div className="progress-bar" style={{ width: '60%' }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--ds-font-size-xs)', color: 'rgb(var(--np-text-muted))', marginBottom: 'var(--space-2)' }}>Standard (6px)</div>
            <div className="progress">
              <div className="progress-bar" style={{ width: '60%' }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--ds-font-size-xs)', color: 'rgb(var(--np-text-muted))', marginBottom: 'var(--space-2)' }}>Groß (10px)</div>
            <div className="progress" style={{ height: 10 }}>
              <div className="progress-bar" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">In Karten-Kontext</h2>
        <div className="grid grid-2">
          {[
            { title: 'Speicher', used: 73, total: '73 GB / 100 GB', variant: 'danger' },
            { title: 'Bandbreite', used: 42, total: '4.2 GB / 10 GB', variant: '' },
            { title: 'API-Aufrufe', used: 88, total: '8.800 / 10.000', variant: 'danger' },
            { title: 'Team-Auslastung', used: 55, total: '11 / 20 Mitglieder', variant: '' },
          ].map(({ title, used, total, variant }) => (
            <div className="stat-tile" key={title}>
              <div className="stat-label-row">
                <div className="stat-label">{title}</div>
                <span style={{ fontSize: 'var(--ds-font-size-xs)', fontWeight: 600, color: used > 80 ? 'rgb(var(--np-danger))' : 'rgb(var(--np-text-muted))' }}>{used}%</span>
              </div>
              <div className="progress" style={{ margin: 'var(--space-2) 0' }}>
                <div className={`progress-bar${variant ? ` ${variant}` : ''}`} style={{ width: `${used}%` }} />
              </div>
              <div className="stat-delta">{total}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
