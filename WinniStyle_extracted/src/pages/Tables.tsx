import { Pencil, Trash2, Check, Clock, X } from 'lucide-react'

const ROWS = [
  { initials: 'AK', name: 'Anna Kaufmann',  role: 'Admin',   status: 'success',   statusLabel: 'Aktiv',      date: '01.03.2025', StatusIcon: Check },
  { initials: 'BM', name: 'Ben Müller',     role: 'Editor',  status: 'warning',   statusLabel: 'Ausstehend', date: '15.03.2025', StatusIcon: Clock },
  { initials: 'CW', name: 'Clara Weber',    role: 'Viewer',  status: 'secondary', statusLabel: 'Inaktiv',    date: '22.04.2025', StatusIcon: X },
  { initials: 'DH', name: 'David Hartmann', role: 'Editor',  status: 'danger',    statusLabel: 'Fehler',     date: '28.04.2025', StatusIcon: X },
  { initials: 'EL', name: 'Eva Lang',       role: 'Designer',status: 'success',   statusLabel: 'Aktiv',      date: '02.05.2025', StatusIcon: Check },
]

export default function Tables() {
  return (
    <>
      <div className="page-header">
        <h1>Tabellen</h1>
        <p>Daten-Tabellen mit Badges, Avataren und Aktions-Buttons.</p>
      </div>

      <section className="section">
        <h2 className="section-title">Standard-Tabelle</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Rolle</th>
                <th>Status</th>
                <th>Erstellt</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(row => (
                <tr key={row.name}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar avatar-sm">{row.initials}</div>
                      {row.name}
                    </div>
                  </td>
                  <td style={{ color: 'rgb(var(--np-text-muted))' }}>{row.role}</td>
                  <td>
                    <span className={`badge badge-${row.status}`}>
                      <row.StatusIcon size={10} /> {row.statusLabel}
                    </span>
                  </td>
                  <td style={{ color: 'rgb(var(--np-text-muted))', fontSize: 'var(--ds-font-size-xs)' }}>{row.date}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-sm btn-ghost btn-icon" data-tooltip="Bearbeiten"><Pencil size={13} /></button>
                      <button className="btn btn-sm btn-ghost btn-icon" data-tooltip="Löschen"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Kompakt (ohne Avatare)</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Rolle</th>
                <th>Status</th>
                <th>Datum</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.name}>
                  <td style={{ color: 'rgb(var(--np-text-muted))', fontSize: 'var(--ds-font-size-xs)' }}>{i + 1}</td>
                  <td style={{ fontWeight: 500 }}>{row.name}</td>
                  <td style={{ color: 'rgb(var(--np-text-muted))' }}>{row.role}</td>
                  <td><span className={`badge badge-${row.status}`}>{row.statusLabel}</span></td>
                  <td style={{ color: 'rgb(var(--np-text-muted))', fontSize: 'var(--ds-font-size-xs)' }}>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
