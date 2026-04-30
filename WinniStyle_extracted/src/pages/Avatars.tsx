export default function Avatars() {
  const people = [
    { initials: 'AK', name: 'Anna Kaufmann',  role: 'Admin',    status: 'online' },
    { initials: 'BM', name: 'Ben Müller',     role: 'Editor',   status: 'away' },
    { initials: 'CW', name: 'Clara Weber',    role: 'Viewer',   status: 'offline' },
    { initials: 'DH', name: 'David Hartmann', role: 'Editor',   status: 'online' },
    { initials: 'EL', name: 'Eva Lang',       role: 'Designer', status: 'busy' },
  ]

  const statusColor: Record<string, string> = {
    online:  'rgb(var(--np-success))',
    away:    'rgb(var(--np-warning))',
    busy:    'rgb(var(--np-danger))',
    offline: 'rgb(var(--np-border))',
  }

  return (
    <>
      <div className="page-header">
        <h1>Avatare</h1>
        <p>Nutzer-Avatare in verschiedenen Größen, Gruppen und mit Status-Indikatoren.</p>
      </div>

      <section className="section">
        <h2 className="section-title">Größen</h2>
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="avatar" style={{ width: '1.75rem', height: '1.75rem', fontSize: 'var(--ds-font-size-xs)' }}>SM</div>
            <div className="avatar">MD</div>
            <div className="avatar avatar-lg">LG</div>
            <div className="avatar" style={{ width: '3.5rem', height: '3.5rem', fontSize: 'var(--ds-font-size-lg)' }}>XL</div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Avatar-Gruppe (gestapelt)</h2>
        <div className="card">
          <div style={{ display: 'flex', marginLeft: 'var(--space-2)' }}>
            {people.slice(0, 4).map((p, i) => (
              <div
                key={p.initials}
                className="avatar"
                title={p.name}
                style={{ marginLeft: i === 0 ? 0 : '-0.65rem', zIndex: 10 - i, boxShadow: '0 0 0 2px rgb(var(--np-surface))' }}
              >
                {p.initials}
              </div>
            ))}
            <div
              className="avatar"
              style={{ marginLeft: '-0.65rem', zIndex: 5, boxShadow: '0 0 0 2px rgb(var(--np-surface))', background: 'rgb(var(--np-border) / 0.5)', color: 'rgb(var(--np-text-muted))', fontSize: 'var(--ds-font-size-xs)' }}
            >
              +3
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Mit Status</h2>
        <div className="card">
          <div className="flex flex-wrap gap-6">
            {people.map(p => (
              <div key={p.initials} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{ position: 'relative', display: 'inline-flex' }}>
                  <div className="avatar avatar-lg">{p.initials}</div>
                  <span style={{
                    position: 'absolute', bottom: 1, right: 1,
                    width: '0.65rem', height: '0.65rem',
                    borderRadius: '50%',
                    background: statusColor[p.status],
                    boxShadow: '0 0 0 2px rgb(var(--np-surface))',
                  }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--ds-font-size-xs)', fontWeight: 600 }}>{p.initials}</div>
                  <div style={{ fontSize: 'var(--ds-font-size-2xs)', color: 'rgb(var(--np-text-muted))' }}>{p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">In Listen-Zeilen</h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {people.map((p, i) => (
            <div
              key={p.initials}
              className="flex items-center gap-3"
              style={{
                padding: 'var(--space-3) var(--space-5)',
                borderBottom: i < people.length - 1 ? '1px solid rgb(var(--np-border) / 0.4)' : 'none',
              }}
            >
              <div style={{ position: 'relative' }}>
                <div className="avatar">{p.initials}</div>
                <span style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '0.55rem', height: '0.55rem',
                  borderRadius: '50%',
                  background: statusColor[p.status],
                  boxShadow: '0 0 0 2px rgb(var(--np-surface))',
                }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 'var(--ds-font-size-sm)' }}>{p.name}</div>
                <div style={{ fontSize: 'var(--ds-font-size-xs)', color: 'rgb(var(--np-text-muted))' }}>{p.role}</div>
              </div>
              <span style={{ fontSize: 'var(--ds-font-size-xs)', color: statusColor[p.status], fontWeight: 500, textTransform: 'capitalize' }}>
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
