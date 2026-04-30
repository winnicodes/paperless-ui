import { BarChart2, ClipboardList, Users, TrendingUp, TrendingDown, Folder } from 'lucide-react'
import { NAV_GROUPS } from '../config/nav'

interface Props {
  onNavigate?: (id: string) => void
}

export default function Overview({ onNavigate }: Props) {
  return (
    <>
      <div className="page-header">
        <h1>Übersicht</h1>
        <p>Design-System Komponenten auf einen Blick. Wähle eine Kategorie aus der Sidebar.</p>
      </div>

      <section className="section">
        <h2 className="section-title">Kennzahlen</h2>
        <div className="grid grid-4">
          <div className="stat-tile">
            <div className="stat-label-row">
              <div className="stat-label">Projekte</div>
              <Folder size={16} style={{ color: 'rgb(var(--np-text-muted))' }} />
            </div>
            <div className="stat-value">24</div>
            <div className="stat-delta up"><TrendingUp size={12} /> 3 diese Woche</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label-row">
              <div className="stat-label">Aufgaben</div>
              <ClipboardList size={16} style={{ color: 'rgb(var(--np-text-muted))' }} />
            </div>
            <div className="stat-value">142</div>
            <div className="stat-delta down"><TrendingDown size={12} /> 8 offen</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label-row">
              <div className="stat-label">Team</div>
              <Users size={16} style={{ color: 'rgb(var(--np-text-muted))' }} />
            </div>
            <div className="stat-value">7</div>
            <div className="stat-delta">Mitglieder</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label-row">
              <div className="stat-label">Fortschritt</div>
              <BarChart2 size={16} style={{ color: 'rgb(var(--np-text-muted))' }} />
            </div>
            <div className="stat-value">68%</div>
            <div className="stat-delta up"><TrendingUp size={12} /> Auf Kurs</div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Komponenten</h2>
        <div className="component-directory">
          {NAV_GROUPS.filter(group => group.items.some(item => item.id !== 'overview')).map(group => (
            <div className="component-group" key={group.title}>
              <div className="component-group-title">{group.title}</div>
              <div className="component-grid">
                {group.items.filter(item => item.id !== 'overview').map(item => (
                  <button
                    key={item.id}
                    className="component-tile"
                    disabled={item.soon}
                    onClick={() => onNavigate?.(item.id)}
                    type="button"
                  >
                    <span className="component-tile-icon">{item.icon}</span>
                    <span className="component-tile-label">{item.label}</span>
                    {item.soon && <span className="component-tile-soon">bald</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
