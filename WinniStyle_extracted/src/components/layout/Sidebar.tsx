import { Settings, CircleHelp, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NAV_GROUPS } from '../../config/nav'

interface Props {
  collapsed: boolean
  activePage: string
  onNavigate: (id: string) => void
  onToggle: () => void
}

export default function Sidebar({ collapsed, activePage, onNavigate, onToggle }: Props) {
  return (
    <aside className="sidebar">

      {NAV_GROUPS.map(group => (
        <div className="sidebar-group" key={group.title}>
          <p className="sidebar-section-title">{group.title}</p>
          {group.items.map(item => (
            <div
              key={item.id}
              className={`sidebar-item${activePage === item.id ? ' active' : ''}${item.soon ? ' soon' : ''}`}
              title={collapsed ? item.label : undefined}
              onClick={() => !item.soon && onNavigate(item.id)}
            >
              {item.icon}
              <span className="sidebar-label">
                {item.label}
                {item.soon && <span className="sidebar-soon">bald</span>}
              </span>
            </div>
          ))}
        </div>
      ))}

      <div className="sidebar-spacer" />

      <div className="sidebar-group">
        <div className="sidebar-item" title={collapsed ? 'Einstellungen' : undefined}>
          <Settings size={16} strokeWidth={1.75} />
          <span className="sidebar-label">Einstellungen</span>
        </div>
        <div className="sidebar-item" title={collapsed ? 'Hilfe' : undefined}>
          <CircleHelp size={16} strokeWidth={1.75} />
          <span className="sidebar-label">Hilfe</span>
        </div>
      </div>

      <div style={{
        padding: 'var(--space-2) 0 0',
        borderTop: '1px solid rgb(var(--np-border) / 0.35)',
        marginTop: 'var(--space-2)',
      }}>
        <button
          className="sidebar-collapse-btn"
          onClick={onToggle}
          title={collapsed ? 'Ausklappen' : 'Einklappen'}
        >
          {collapsed
            ? <PanelLeftOpen  size={16} strokeWidth={1.75} className="icon-expand" />
            : <PanelLeftClose size={16} strokeWidth={1.75} className="icon-collapse" />
          }
          <span className="sidebar-label">Einklappen</span>
        </button>
      </div>

    </aside>
  )
}
