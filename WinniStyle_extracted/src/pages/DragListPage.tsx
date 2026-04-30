import { useState } from 'react'
import { Plus, GripVertical, Pencil, X, Check } from 'lucide-react'
import { Sortable, SortableItem, SortableItemHandle } from '../components/ui/Sortable'

interface Field {
  id: string
  name: string
  type: string
}

const FIELD_TYPES = [
  'Textfeld',
  'Datumsfeld',
  'Währungsfeld',
  'Zahlenfeld',
  'Auswahlfeld',
  'Ja / Nein',
]

const INITIAL_FIELDS: Field[] = [
  { id: '1', name: 'Modell',       type: 'Textfeld'     },
  { id: '2', name: 'SN',           type: 'Textfeld'     },
  { id: '3', name: 'Kämmerei',     type: 'Textfeld'     },
  { id: '4', name: 'Gekauft am',   type: 'Datumsfeld'   },
  { id: '5', name: 'Garantie bis', type: 'Datumsfeld'   },
  { id: '6', name: 'Bruttopreis',  type: 'Währungsfeld' },
  { id: '7', name: 'Nettopreis',   type: 'Währungsfeld' },
]

type EditState =
  | { mode: 'idle' }
  | { mode: 'add' }
  | { mode: 'edit'; id: string }

export default function DragListPage() {
  const [fields,   setFields]   = useState<Field[]>(INITIAL_FIELDS)
  const [editing,  setEditing]  = useState<EditState>({ mode: 'idle' })
  const [formName, setFormName] = useState('')
  const [formType, setFormType] = useState(FIELD_TYPES[0])

  const openAdd = () => {
    setFormName('')
    setFormType(FIELD_TYPES[0])
    setEditing({ mode: 'add' })
  }

  const openEdit = (field: Field) => {
    setFormName(field.name)
    setFormType(field.type)
    setEditing({ mode: 'edit', id: field.id })
  }

  const cancel = () => setEditing({ mode: 'idle' })

  const save = () => {
    const name = formName.trim()
    if (!name) return
    if (editing.mode === 'add') {
      setFields(prev => [...prev, { id: String(Date.now()), name, type: formType }])
    } else if (editing.mode === 'edit') {
      setFields(prev => prev.map(f => f.id === editing.id ? { ...f, name, type: formType } : f))
    }
    setEditing({ mode: 'idle' })
  }

  const remove = (id: string) => setFields(prev => prev.filter(f => f.id !== id))

  return (
    <>
      <div className="page-header">
        <h1>Drag &amp; Drop Liste</h1>
        <p>Sortierbare Liste mit Drag Handle, Inline-Bearbeitung und FLIP-Animation.</p>
      </div>

      <section className="section">
        <div className="dl-section-head">
          <span className="dl-section-title">Zusätzliche Felder</span>
          <button className="btn btn-secondary btn-sm" onClick={openAdd}>
            <Plus size={14} strokeWidth={2} />
            Feld hinzufügen
          </button>
        </div>

        <div className="card dl-card">

          {/* Inline add/edit form */}
          {editing.mode !== 'idle' && (
            <div className="dl-form">
              <div className="field" style={{ flex: 1 }}>
                <label className="label">Feldname</label>
                <input
                  className="input"
                  type="text"
                  placeholder="z. B. Seriennummer"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel() }}
                  autoFocus
                />
              </div>
              <div className="field" style={{ width: '9rem', flexShrink: 0 }}>
                <label className="label">Feldtyp</label>
                <select
                  className="select"
                  value={formType}
                  onChange={e => setFormType(e.target.value)}
                >
                  {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="dl-form-actions">
                <button className="btn btn-primary btn-sm" onClick={save}>
                  <Check size={14} />
                  Speichern
                </button>
                <button className="btn btn-ghost btn-sm" onClick={cancel}>Abbrechen</button>
              </div>
            </div>
          )}

          {/* Table head */}
          <div className="dl-table-head">
            <span />
            <span className="dl-col-label">Feldname</span>
            <span className="dl-col-label">Feldtyp</span>
            <span />
            <span />
          </div>

          {/* Sortable list */}
          <Sortable value={fields} onValueChange={setFields} getItemValue={f => f.id}>
            <div className="dl-list">
              {fields.map(field => (
                <SortableItem key={field.id} value={field.id} className="dl-row">
                  <SortableItemHandle>
                    <GripVertical size={16} strokeWidth={1.75} />
                  </SortableItemHandle>
                  <span className="dl-name">{field.name}</span>
                  <span className="dl-type">{field.type}</span>
                  <button
                    className="btn btn-ghost btn-icon"
                    onClick={() => openEdit(field)}
                    aria-label="Bearbeiten"
                  >
                    <Pencil size={14} strokeWidth={1.75} />
                  </button>
                  <button
                    className="btn btn-ghost btn-icon dl-delete"
                    onClick={() => remove(field.id)}
                    aria-label="Löschen"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </SortableItem>
              ))}
            </div>
          </Sortable>

          {fields.length === 0 && (
            <p className="dl-empty">Keine Felder vorhanden. Füge das erste Feld hinzu.</p>
          )}
        </div>
      </section>
    </>
  )
}
