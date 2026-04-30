import { useState, type ComponentType } from 'react'
import Header   from './components/layout/Header'
import Sidebar  from './components/layout/Sidebar'
import Overview    from './pages/Overview'
import Buttons     from './pages/Buttons'
import Badges      from './pages/Badges'
import Alerts      from './pages/Alerts'
import Avatars     from './pages/Avatars'
import Inputs      from './pages/Inputs'
import Tables      from './pages/Tables'
import Progress    from './pages/Progress'
import Cards       from './pages/Cards'
import Typography  from './pages/Typography'
import Login        from './pages/Login'
import TreeViewPage  from './pages/TreeViewPage'
import DragListPage  from './pages/DragListPage'
import Tokens        from './pages/Tokens'

const PAGES: Record<string, ComponentType<{ onNavigate?: (id: string) => void }>> = {
  overview:   Overview,
  buttons:    Buttons,
  badges:     Badges,
  alerts:     Alerts,
  avatars:    Avatars,
  inputs:     Inputs,
  tables:     Tables,
  progress:   Progress,
  cards:      Cards,
  typography: Typography,
  login:      Login,
  treeview:   TreeViewPage,
  draglist:   DragListPage,
  tokens:     Tokens,
}

export default function App() {
  const [collapsed, setCollapsed]   = useState(false)
  const [darkMode,  setDarkMode]    = useState(false)
  const [page,      setPage]        = useState('overview')

  const toggleTheme = () => {
    const next = !darkMode
    setDarkMode(next)
    document.documentElement.setAttribute('data-theme', next ? 'ember-noir' : '')
  }

  const Page = PAGES[page] ?? Overview

  return (
    <div className={`app-shell${collapsed ? ' collapsed' : ''}`}>
      <Header
        activePage={page}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
      />
      <Sidebar
        collapsed={collapsed}
        activePage={page}
        onNavigate={setPage}
        onToggle={() => setCollapsed(c => !c)}
      />
      <main className="main-content">
        <div className="main-container">
          <Page onNavigate={setPage} />
        </div>
      </main>
    </div>
  )
}
