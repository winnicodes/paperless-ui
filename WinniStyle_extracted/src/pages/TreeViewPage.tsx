import { useState } from 'react'
import { Building2, Layers, DoorOpen, Server, HardDrive, Cpu } from 'lucide-react'
import { TreeView, type TreeNode } from '../components/ui/TreeView'

const DEMO_NODES: TreeNode[] = [
  {
    id: 'standort-1',
    label: 'Hauptgebäude',
    icon: <Building2 size={14} strokeWidth={1.75} />,
    children: [
      {
        id: 'eg',
        label: 'Erdgeschoss',
        icon: <Layers size={14} strokeWidth={1.75} />,
        children: [
          { id: 'eg-01', label: 'Empfang',       icon: <DoorOpen size={14} strokeWidth={1.75} /> },
          { id: 'eg-02', label: 'Serverraum A',  icon: <Server   size={14} strokeWidth={1.75} /> },
          { id: 'eg-03', label: 'Lager',         icon: <DoorOpen size={14} strokeWidth={1.75} /> },
        ],
      },
      {
        id: 'og1',
        label: '1. Obergeschoss',
        icon: <Layers size={14} strokeWidth={1.75} />,
        children: [
          { id: 'og1-01', label: 'Büro 101',          icon: <DoorOpen size={14} strokeWidth={1.75} /> },
          { id: 'og1-02', label: 'Büro 102',          icon: <DoorOpen size={14} strokeWidth={1.75} /> },
          { id: 'og1-03', label: 'Besprechung West',  icon: <DoorOpen size={14} strokeWidth={1.75} /> },
        ],
      },
      {
        id: 'og2',
        label: '2. Obergeschoss',
        icon: <Layers size={14} strokeWidth={1.75} />,
        children: [
          { id: 'og2-01', label: 'Büro 201', icon: <DoorOpen size={14} strokeWidth={1.75} /> },
          { id: 'og2-02', label: 'Büro 202', icon: <DoorOpen size={14} strokeWidth={1.75} /> },
        ],
      },
    ],
  },
  {
    id: 'standort-2',
    label: 'Nebengebäude',
    icon: <Building2 size={14} strokeWidth={1.75} />,
    children: [
      {
        id: 'nb-eg',
        label: 'Erdgeschoss',
        icon: <Layers size={14} strokeWidth={1.75} />,
        children: [
          { id: 'nb-01', label: 'Werkstatt',     icon: <DoorOpen size={14} strokeWidth={1.75} /> },
          { id: 'nb-02', label: 'Serverraum B',  icon: <Server   size={14} strokeWidth={1.75} /> },
        ],
      },
    ],
  },
  {
    id: 'infrastruktur',
    label: 'Infrastruktur',
    icon: <Server size={14} strokeWidth={1.75} />,
    children: [
      {
        id: 'srv-gruppe-a',
        label: 'Server Gruppe A',
        icon: <HardDrive size={14} strokeWidth={1.75} />,
        children: [
          { id: 'srv-01', label: 'srv-prod-01', icon: <Cpu size={14} strokeWidth={1.75} /> },
          { id: 'srv-02', label: 'srv-prod-02', icon: <Cpu size={14} strokeWidth={1.75} /> },
          { id: 'srv-03', label: 'srv-backup',  icon: <Cpu size={14} strokeWidth={1.75} /> },
        ],
      },
      {
        id: 'srv-gruppe-b',
        label: 'Server Gruppe B',
        icon: <HardDrive size={14} strokeWidth={1.75} />,
        children: [
          { id: 'srv-04', label: 'srv-dev-01',  icon: <Cpu size={14} strokeWidth={1.75} /> },
          { id: 'srv-05', label: 'srv-staging', icon: <Cpu size={14} strokeWidth={1.75} /> },
        ],
      },
    ],
  },
]

export default function TreeViewPage() {
  const [selectedId, setSelectedId] = useState<string | undefined>()

  return (
    <>
      <div className="page-header">
        <h1>TreeView</h1>
        <p>Hierarchische Baumstruktur mit Suche, Expand/Collapse all und Auswahl.</p>
      </div>

      <section className="section">
        <h2 className="section-title">Demo</h2>
        <div className="card" style={{ maxWidth: '22rem' }}>
          <TreeView nodes={DEMO_NODES} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </section>
    </>
  )
}
