import * as React from 'react'

type SortPosition = 'before' | 'after'

type SortableContextValue<T> = {
  value: T[]
  onValueChange: (value: T[]) => void
  getItemValue: (item: T) => string
  dragValue: string | null
  setDragValue: (value: string | null) => void
  moveItem: (draggedId: string, overId: string, position: SortPosition) => void
  registerItemNode: (value: string, node: HTMLElement | null) => void
}

const SortableContext = React.createContext<SortableContextValue<any> | null>(null)

function useSortableContext<T>() {
  const ctx = React.useContext(SortableContext) as SortableContextValue<T> | null
  if (!ctx) throw new Error('Sortable components must be used within <Sortable>.')
  return ctx
}

export function Sortable<T>({
  value,
  onValueChange,
  getItemValue,
  children,
}: {
  value: T[]
  onValueChange: (value: T[]) => void
  getItemValue: (item: T) => string
  children: React.ReactNode
}) {
  const [dragValue, setDragValue] = React.useState<string | null>(null)
  const itemNodesRef       = React.useRef(new Map<string, HTMLElement>())
  const previousRectsRef   = React.useRef(new Map<string, DOMRect>())
  const didMountRef        = React.useRef(false)

  const registerItemNode = React.useCallback((itemValue: string, node: HTMLElement | null) => {
    if (node) {
      itemNodesRef.current.set(itemValue, node)
    } else {
      itemNodesRef.current.delete(itemValue)
      previousRectsRef.current.delete(itemValue)
    }
  }, [])

  const moveItem = React.useCallback((draggedId: string, overId: string, position: SortPosition) => {
    if (!draggedId || !overId || draggedId === overId) return
    const fromIndex = value.findIndex(item => getItemValue(item) === draggedId)
    const overIndex = value.findIndex(item => getItemValue(item) === overId)
    if (fromIndex < 0 || overIndex < 0) return

    const next = [...value]
    const [moved] = next.splice(fromIndex, 1)
    const overIndexAfterRemoval = fromIndex < overIndex ? overIndex - 1 : overIndex
    const insertAt = Math.max(0, Math.min(next.length, overIndexAfterRemoval + (position === 'after' ? 1 : 0)))
    if (insertAt === fromIndex) return

    next.splice(insertAt, 0, moved)
    onValueChange(next)
  }, [getItemValue, onValueChange, value])

  // FLIP animation
  React.useLayoutEffect(() => {
    const nextRects = new Map<string, DOMRect>()
    for (const [id, node] of itemNodesRef.current.entries()) {
      nextRects.set(id, node.getBoundingClientRect())
    }
    if (!didMountRef.current) {
      previousRectsRef.current = nextRects
      didMountRef.current = true
      return
    }
    for (const [id, nextRect] of nextRects.entries()) {
      const node = itemNodesRef.current.get(id)
      const prev = previousRectsRef.current.get(id)
      if (!node || !prev) continue
      const deltaY = prev.top - nextRect.top
      if (Math.abs(deltaY) < 0.5) continue
      node.animate(
        [{ transform: `translateY(${deltaY}px)` }, { transform: 'translateY(0px)' }],
        { duration: 180, easing: 'cubic-bezier(0.2, 0, 0, 1)' }
      )
    }
    previousRectsRef.current = nextRects
  }, [value])

  return (
    <SortableContext.Provider value={{ value, onValueChange, getItemValue, dragValue, setDragValue, moveItem, registerItemNode }}>
      {children}
    </SortableContext.Provider>
  )
}

export function SortableItem({
  value,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const ctx     = useSortableContext<any>()
  const itemRef = React.useRef<HTMLDivElement | null>(null)
  const isDragging = ctx.dragValue === value

  React.useLayoutEffect(() => {
    ctx.registerItemNode(value, itemRef.current)
    return () => ctx.registerItemNode(value, null)
  }, [ctx, value])

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    ctx.setDragValue(value)
    try {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', value)
      const rect = itemRef.current?.getBoundingClientRect()
      if (rect?.width && rect?.height) {
        const w = Math.max(1, Math.round(rect.width - 8))
        const h = Math.max(1, Math.round(rect.height))
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const c = canvas.getContext('2d')
        if (c) {
          c.fillStyle = 'rgba(112, 118, 129, 0.78)'
          c.fillRect(0, 0, w, h)
          e.dataTransfer.setDragImage(canvas, 18, Math.round(h / 2))
        }
      }
    } catch { /* ignore */ }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const dragging = ctx.dragValue
    if (!dragging || dragging === value) return
    const rect = e.currentTarget.getBoundingClientRect()
    const position: SortPosition = e.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
    ctx.moveItem(dragging, value, position)
    try { e.dataTransfer.dropEffect = 'move' } catch { /* ignore */ }
  }

  return (
    <div
      ref={itemRef}
      draggable
      className={['sl-item', isDragging ? 'sl-dragging' : '', className].filter(Boolean).join(' ')}
      onDragStart={handleDragStart}
      onDragEnd={() => ctx.setDragValue(null)}
      onDragOver={handleDragOver}
      onDrop={e => { e.preventDefault(); ctx.setDragValue(null) }}
      {...props}
    >
      {children}
    </div>
  )
}

export function SortableItemHandle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-sortable-handle className={['sl-handle', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  )
}
