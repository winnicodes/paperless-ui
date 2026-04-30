import type { ReactNode } from 'react'
import {
  LayoutDashboard, MousePointerClick, Tag, UserCircle, Bell,
  FormInput, Table, List, Activity, BarChart2,
  Layers, Type, LogIn, Network, GripVertical, Palette,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: ReactNode
  soon?: boolean
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

const s = 16
const w = 1.75

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Allgemein',
    items: [
      { id: 'overview',    label: 'Übersicht',  icon: <LayoutDashboard size={s} strokeWidth={w} /> },
      { id: 'tokens',      label: 'Tokens',     icon: <Palette size={s} strokeWidth={w} /> },
    ],
  },
  {
    title: 'UI Elemente',
    items: [
      { id: 'buttons',    label: 'Buttons',    icon: <MousePointerClick size={s} strokeWidth={w} /> },
      { id: 'badges',     label: 'Badges',     icon: <Tag size={s} strokeWidth={w} /> },
      { id: 'avatars',    label: 'Avatare',    icon: <UserCircle size={s} strokeWidth={w} /> },
      { id: 'alerts',     label: 'Alerts',     icon: <Bell size={s} strokeWidth={w} /> },
    ],
  },
  {
    title: 'Formulare',
    items: [
      { id: 'inputs',     label: 'Eingaben',   icon: <FormInput size={s} strokeWidth={w} /> },
    ],
  },
  {
    title: 'Daten',
    items: [
      { id: 'tables',     label: 'Tabellen',   icon: <Table size={s} strokeWidth={w} /> },
      { id: 'lists',      label: 'Listen',     icon: <List size={s} strokeWidth={w} />,     soon: true },
      { id: 'draglist',   label: 'Drag List',  icon: <GripVertical size={s} strokeWidth={w} /> },
      { id: 'progress',   label: 'Progress',   icon: <Activity size={s} strokeWidth={w} /> },
      { id: 'charts',     label: 'Charts',     icon: <BarChart2 size={s} strokeWidth={w} />, soon: true },
    ],
  },
  {
    title: 'Layout',
    items: [
      { id: 'cards',      label: 'Karten',     icon: <Layers size={s} strokeWidth={w} /> },
      { id: 'typography', label: 'Typografie', icon: <Type size={s} strokeWidth={w} /> },
      { id: 'treeview',   label: 'TreeView',   icon: <Network size={s} strokeWidth={w} /> },
    ],
  },
  {
    title: 'Seiten',
    items: [
      { id: 'login', label: 'Login', icon: <LogIn size={s} strokeWidth={w} /> },
    ],
  },
]
