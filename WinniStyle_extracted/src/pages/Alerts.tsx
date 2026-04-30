import { Info, CircleCheck, TriangleAlert, CircleX, X } from 'lucide-react'

export default function Alerts() {
  return (
    <>
      <div className="page-header">
        <h1>Alerts</h1>
        <p>Hinweise, Erfolgsmeldungen, Warnungen und Fehlermeldungen.</p>
      </div>

      <section className="section">
        <h2 className="section-title">Varianten</h2>
        <div className="flex-col gap-3">
          <div className="alert alert-info">
            <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>Das ist eine <strong>Info-Meldung</strong>. Hier stehen neutrale Hinweise.</div>
          </div>
          <div className="alert alert-success">
            <CircleCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>Aktion <strong>erfolgreich</strong> abgeschlossen. Alle Änderungen wurden gespeichert.</div>
          </div>
          <div className="alert alert-warning">
            <TriangleAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <div><strong>Achtung:</strong> Diese Aktion kann nicht rückgängig gemacht werden.</div>
          </div>
          <div className="alert alert-danger">
            <CircleX size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>Es ist ein <strong>Fehler</strong> aufgetreten. Bitte versuche es erneut.</div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Mit Titel und Aktion</h2>
        <div className="flex-col gap-3">
          {[
            { variant: 'info',    Icon: Info,          title: 'Neue Version verfügbar',       msg: 'Version 2.1.0 enthält wichtige Bugfixes und neue Features.' },
            { variant: 'success', Icon: CircleCheck,   title: 'Erfolgreich gespeichert',       msg: 'Deine Einstellungen wurden aktualisiert.' },
            { variant: 'warning', Icon: TriangleAlert, title: 'Sitzung läuft bald ab',         msg: 'Du wirst in 5 Minuten automatisch abgemeldet.' },
            { variant: 'danger',  Icon: CircleX,       title: 'Verbindung unterbrochen',       msg: 'Server nicht erreichbar. Bitte Netzwerkverbindung prüfen.' },
          ].map(({ variant, Icon, title, msg }) => (
            <div key={variant} className={`alert alert-${variant}`} style={{ alignItems: 'flex-start' }}>
              <Icon size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{title}</div>
                <div style={{ opacity: 0.85 }}>{msg}</div>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', opacity: 0.6, padding: 0 }}
                aria-label="Schließen"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
