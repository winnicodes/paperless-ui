import React, { useMemo, useState, useRef, useCallback } from 'react';
import { FileText, Calendar, Pencil, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { type Document, type Tag } from '../services/paperless';
import { useLang } from '../contexts/LanguageContext';
import { adaptiveTagColor } from '../lib/tagColor';

interface DocumentListItemProps {
  doc: Document;
  tags: Tag[];
  onClick: () => void;
  darkMode: boolean;
  onRename?: (id: number, newTitle: string) => Promise<void>;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({ doc, tags, onClick, darkMode, onRename }) => {
  const { t } = useLang();
  const docTags = useMemo(() => tags.filter(tag => doc.tags?.includes(tag.id)), [doc.tags, tags]);

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [saving, setSaving] = useState(false);
  const saveRef = useRef(false);

  const startEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue(doc.title);
    setEditing(true);
    saveRef.current = false;
  }, [doc.title]);

  const save = useCallback(async () => {
    if (saveRef.current) return;
    saveRef.current = true;
    const trimmed = inputValue.trim();
    if (!trimmed || trimmed === doc.title) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onRename?.(doc.id, trimmed);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }, [inputValue, doc.title, doc.id, onRename]);

  const cancel = useCallback(() => {
    saveRef.current = true;
    setEditing(false);
  }, []);

  return (
    <tr
      className="group"
      style={{ cursor: editing ? 'default' : 'pointer' }}
      onClick={editing ? undefined : onClick}
    >
      <td>
        <div className="flex items-center gap-3">
          <div
            className="avatar avatar-sm shrink-0"
            style={{ background: 'rgb(var(--np-brand) / 0.15)', color: 'rgb(var(--np-brand-dark))' }}
          >
            <FileText size={14} />
          </div>
          {editing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flex: 1 }} onClick={e => e.stopPropagation()}>
              <input
                className="rename-input"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') { e.preventDefault(); save(); }
                  if (e.key === 'Escape') cancel();
                }}
                onBlur={save}
                disabled={saving}
                autoFocus
              />
              {saving && <Loader2 size={12} className="rename-saving" style={{ flexShrink: 0 }} />}
            </div>
          ) : (
            <div className="flex items-center gap-1 min-w-0">
              <span style={{ fontWeight: 500 }}>{doc.title}</span>
              {onRename && (
                <button
                  className="rename-btn group-hover:opacity-100"
                  onClick={startEdit}
                  title={t.renameDoc}
                >
                  <Pencil size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      </td>
      <td style={{ color: 'rgb(var(--np-text-muted))', whiteSpace: 'nowrap' }}>
        <div className="flex items-center gap-1">
          <Calendar size={11} />
          {format(parseISO(doc.created), t.dateFormat, { locale: t.dateLocale })}
        </div>
      </td>
      <td>
        <div className="flex flex-wrap gap-1.5">
          {docTags.map(tag => (
            <span
              key={tag.id}
              className="badge"
              style={{
                backgroundColor: `${tag.color}15`,
                borderColor: `${tag.color}55`,
                color: adaptiveTagColor(tag.color, darkMode),
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
};

export default DocumentListItem;
