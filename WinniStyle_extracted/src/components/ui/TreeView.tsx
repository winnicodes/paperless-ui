import { useState, useMemo, type ReactNode } from 'react'
import { Search, ChevronRight, UnfoldVertical, FoldVertical } from 'lucide-react'

export interface TreeNode {
  id: string
  label: string
  icon?: ReactNode
  children?: TreeNode[]
}

interface Props {
  nodes: TreeNode[]
  selectedId?: string
  onSelect?: (id: string) => void
}

// ---- Helpers ----------------------------------------------------------------

const normalize = (s: string) => s.toLowerCase().trim()

function filterTree(nodes: TreeNode[], q: string): TreeNode[] {
  if (!q) return nodes
  return nodes.reduce<TreeNode[]>((acc, node) => {
    const filteredChildren = filterTree(node.children ?? [], q)
    if (normalize(node.label).includes(q) || filteredChildren.length > 0)
      acc.push({ ...node, children: filteredChildren })
    return acc
  }, [])
}

function collectIds(nodes: TreeNode[]): string[] {
  return nodes.flatMap(n => {
    const kids = n.children ?? []
    return kids.length > 0 ? [n.id, ...collectIds(kids)] : []
  })
}

function highlight(text: string, query: string) {
  if (!query) return <>{text}</>
  const idx = normalize(text).indexOf(query)
  if (idx < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

// ---- Recursive node list ----------------------------------------------------

function NodeList({
  nodes, query, expandedIds, selectedId, onToggle, onSelect,
}: {
  nodes: TreeNode[]
  query: string
  expandedIds: Set<string>
  selectedId?: string
  onToggle: (id: string) => void
  onSelect: (id: string) => void
}) {
  return (
    <div className="tv-nodes">
      {nodes.map(node => {
        const hasChildren = (node.children?.length ?? 0) > 0
        const isExpanded = expandedIds.has(node.id)
        const isSelected = selectedId === node.id
        return (
          <div key={node.id}>
            <div
              className={`tv-row${isSelected ? ' tv-selected' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(node.id)}
              onDoubleClick={() => { if (hasChildren) onToggle(node.id) }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(node.id) }
                if (e.key === 'ArrowRight' && hasChildren && !isExpanded) onToggle(node.id)
                if (e.key === 'ArrowLeft'  && hasChildren && isExpanded)  onToggle(node.id)
              }}
            >
              {hasChildren ? (
                <button
                  className={`tv-toggle${isExpanded ? ' tv-open' : ''}`}
                  onClick={e => { e.stopPropagation(); onToggle(node.id) }}
                  aria-label={isExpanded ? 'Einklappen' : 'Ausklappen'}
                >
                  <ChevronRight strokeWidth={2} />
                </button>
              ) : (
                <span className="tv-toggle-placeholder" />
              )}

              {node.icon && <span className="tv-icon">{node.icon}</span>}
              <span className="tv-label">{highlight(node.label, query)}</span>
            </div>

            {hasChildren && isExpanded && (
              <div className="tv-children">
                <NodeList
                  nodes={node.children!}
                  query={query}
                  expandedIds={expandedIds}
                  selectedId={selectedId}
                  onToggle={onToggle}
                  onSelect={onSelect}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---- Main component ---------------------------------------------------------

export function TreeView({ nodes, selectedId, onSelect }: Props) {
  const [query,       setQuery]       = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const q = normalize(query)

  const visible = useMemo(() => filterTree(nodes, q), [nodes, q])

  useMemo(() => {
    if (!q) return
    setExpandedIds(new Set(collectIds(visible)))
  }, [q])

  const toggle = (id: string) =>
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const expandAll   = () => setExpandedIds(new Set(collectIds(nodes)))
  const collapseAll = () => setExpandedIds(new Set())

  return (
    <div className="tv-root">
      {/* Toolbar */}
      <div className="tv-toolbar">
        <div className="input-group" style={{ flex: 1 }}>
          <Search className="input-icon" size={15} />
          <input
            className="input"
            type="search"
            placeholder="Suchen…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-ghost btn-icon" onClick={expandAll}   title="Alle ausklappen" aria-label="Alle ausklappen">
          <UnfoldVertical size={15} strokeWidth={1.75} />
        </button>
        <button className="btn btn-ghost btn-icon" onClick={collapseAll} title="Alle einklappen" aria-label="Alle einklappen">
          <FoldVertical size={15} strokeWidth={1.75} />
        </button>
      </div>

      {/* Tree */}
      <div className="tv-scroll">
        {visible.length === 0
          ? <p className="tv-empty">Keine Ergebnisse für „{query}"</p>
          : (
            <NodeList
              nodes={visible}
              query={q}
              expandedIds={expandedIds}
              selectedId={selectedId}
              onToggle={toggle}
              onSelect={id => onSelect?.(id)}
            />
          )
        }
      </div>
    </div>
  )
}
