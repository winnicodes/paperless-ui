import { useMemo } from 'react'
import { Moon, Plus, Sun } from 'lucide-react'
import { NAV_GROUPS } from '../../config/nav'

interface Props {
  activePage: string
  darkMode: boolean
  onToggleTheme: () => void
}

export default function Header({ activePage, darkMode, onToggleTheme }: Props) {
  const activeItem = useMemo(
    () => NAV_GROUPS.flatMap(group => group.items).find(item => item.id === activePage),
    [activePage],
  )

  return (
    <header className="site-header">
      <div className="header-brand">
        <span className="site-logo">WinniStyle</span>
        <span className="header-current">{activeItem?.label ?? 'Übersicht'}</span>
      </div>

      <div className="header-spacer" />

      <button className="btn btn-sm btn-secondary header-create">
        <Plus size={14} strokeWidth={2} />
        Neu
      </button>

      <div className="header-actions">
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Theme wechseln">
          {darkMode ? <Moon size={14} strokeWidth={1.75} /> : <Sun size={14} strokeWidth={1.75} />}
          <span>{darkMode ? 'Dunkel' : 'Hell'}</span>
        </button>

        <div className="avatar" title="Winni">W</div>
      </div>
    </header>
  )
}
