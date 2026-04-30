const H = ({ level }: { level: number }) => {
  const style = {
    fontSize: `var(--ds-font-size-${['3xl','2xl','xl','lg','md','sm'][level - 1]})`,
    fontWeight: 600,
    lineHeight: 1.2,
  }
  return <span style={style}>Überschrift Ebene {level}</span>
}

export default function Typography() {
  return (
    <>
      <div className="page-header">
        <h1>Typografie</h1>
        <p>Schriftgrößen, Gewichte, Farben und das Pacifico Brand-Font.</p>
      </div>

      <section className="section">
        <h2 className="section-title">Überschriften</h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[1, 2, 3, 4, 5, 6].map(level => (
            <div key={level} className="flex items-center gap-4">
              <span style={{ fontSize: 'var(--ds-font-size-xs)', color: 'rgb(var(--np-text-muted))', fontFamily: 'monospace', minWidth: '1.5rem' }}>H{level}</span>
              <H level={level} />
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Schriftgrößen</h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[
            { token: '--ds-font-size-3xl', label: '3xl', size: '1.875rem / 30px' },
            { token: '--ds-font-size-2xl', label: '2xl', size: '1.5rem / 24px' },
            { token: '--ds-font-size-xl',  label: 'xl',  size: '1.25rem / 20px' },
            { token: '--ds-font-size-lg',  label: 'lg',  size: '1.125rem / 18px' },
            { token: '--ds-font-size-md',  label: 'md',  size: '1rem / 16px' },
            { token: '--ds-font-size-sm',  label: 'sm',  size: '0.875rem / 14px' },
            { token: '--ds-font-size-xs',  label: 'xs',  size: '0.75rem / 12px' },
            { token: '--ds-font-size-2xs', label: '2xs', size: '0.6875rem / 11px' },
          ].map(({ token, label, size }) => (
            <div key={label} className="flex items-center gap-4">
              <span style={{ fontSize: 'var(--ds-font-size-xs)', color: 'rgb(var(--np-text-muted))', fontFamily: 'monospace', minWidth: '2.5rem' }}>{label}</span>
              <span style={{ fontSize: `var(${token})` }}>Beispieltext</span>
              <span style={{ fontSize: 'var(--ds-font-size-xs)', color: 'rgb(var(--np-text-muted))', marginLeft: 'auto' }}>{size}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Gewichte</h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {[
            { weight: 400, label: 'Regular (400)' },
            { weight: 500, label: 'Medium (500)' },
            { weight: 600, label: 'Semibold (600)' },
            { weight: 700, label: 'Bold (700)' },
          ].map(({ weight, label }) => (
            <div key={weight} className="flex items-center gap-4">
              <span style={{ fontSize: 'var(--ds-font-size-xs)', color: 'rgb(var(--np-text-muted))', fontFamily: 'monospace', minWidth: '4rem' }}>{weight}</span>
              <span style={{ fontWeight: weight, fontSize: 'var(--ds-font-size-md)' }}>{label} — Inter Schriftschnitt</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Textfarben</h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <p style={{ fontSize: 'var(--ds-font-size-md)' }}>Haupttext — <code>--np-text-main</code></p>
          <p style={{ fontSize: 'var(--ds-font-size-md)', color: 'rgb(var(--np-text-muted))' }}>Gedämpfter Text — <code>--np-text-muted</code></p>
          <p style={{ fontSize: 'var(--ds-font-size-md)', color: 'rgb(var(--np-brand-dark))' }}>Brand-Farbe — <code>--np-brand-dark</code></p>
          <p style={{ fontSize: 'var(--ds-font-size-md)', color: 'rgb(var(--np-success))' }}>Erfolg — <code>--np-success</code></p>
          <p style={{ fontSize: 'var(--ds-font-size-md)', color: 'rgb(var(--np-danger))' }}>Fehler — <code>--np-danger</code></p>
          <p style={{ fontSize: 'var(--ds-font-size-md)', color: 'rgb(var(--np-warning))' }}>Warnung — <code>--np-warning</code></p>
          <p style={{ fontSize: 'var(--ds-font-size-md)', color: 'rgb(var(--np-info))' }}>Info — <code>--np-info</code></p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Brand Font — Pacifico</h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {['var(--ds-font-size-xl)', 'var(--ds-font-size-2xl)', 'var(--ds-font-size-3xl)'].map(size => (
            <p key={size} style={{ fontFamily: "'Pacifico', cursive", fontSize: size, color: 'rgb(var(--np-brand-dark))' }}>
              WinniStyle
            </p>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Inline Elemente</h2>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <p>Normaler Text mit <strong>fettem Inhalt</strong> und <em>kursivem Inhalt</em> gemischt.</p>
          <p>Inline <code>Code-Fragment</code> innerhalb eines Satzes.</p>
          <hr className="divider" />
          <p style={{ lineHeight: 'var(--ds-leading-relaxed)' }}>
            Fließtext mit erhöhter Zeilenhöhe (1.6). Inter bietet exzellente Lesbarkeit auf allen
            Auflösungen. Optimal für längere Textabschnitte und Beschreibungen in der Oberfläche.
          </p>
        </div>
      </section>
    </>
  )
}
