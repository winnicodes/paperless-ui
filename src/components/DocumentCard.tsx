import React, { useMemo, useState, useRef, useCallback } from 'react';
import { FileText, Calendar, Tag as TagIcon, Pencil, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'motion/react';
import { type Document, type Tag } from '../services/paperless';
import { useLang } from '../contexts/LanguageContext';
import { adaptiveTagColor } from '../lib/tagColor';

interface DocumentCardProps {
  doc: Document;
  tags: Tag[];
  onClick: () => void;
  darkMode: boolean;
  onRename?: (id: number, newTitle: string) => Promise<void>;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ doc, tags, onClick, darkMode, onRename }) => {
  const { t } = useLang();
  const docTags = useMemo(() => tags.filter(tag => doc.tags.includes(tag.id)), [doc.tags, tags]);

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const saveRef = useRef(false);

  const startEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue(doc.title);
    setEditing(true);
    saveRef.current = false;
    setTimeout(() => { inputRef.current?.select(); }, 0);
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated card-interactive cursor-pointer group flex flex-col gap-0"
      onClick={editing ? undefined : onClick}
      style={{ cursor: editing ? 'default' : undefined }}
    >
      {/* Card header: avatar + title + date */}
      <div className="card-header" style={{ marginBottom: docTags.length || doc.thumbnail_url ? 'var(--space-4)' : 0 }}>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="avatar shrink-0" style={{ background: 'rgb(var(--np-brand) / 0.15)', color: 'rgb(var(--np-brand-dark))' }}>
            <FileText size={16} />
          </div>
          <div className="min-w-0 flex-1">
            {editing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }} onClick={e => e.stopPropagation()}>
                <input
                  ref={inputRef}
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
              <div className="flex items-center gap-1 min-w-0" style={{ position: 'relative' }}>
                <div
                  className="card-title line-clamp-2 transition-colors flex-1"
                  style={{ fontSize: 'var(--ds-font-size-sm)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgb(var(--np-brand-dark))')}
                  onMouseLeave={e => (e.currentTarget.style.color = '')}
                >
                  {doc.title}
                </div>
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
            <div className="card-description flex items-center gap-1" style={{ marginTop: '0.2rem' }}>
              <Calendar size={11} />
              {format(parseISO(doc.created), t.dateFormat, { locale: t.dateLocale })}
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      {doc.thumbnail_url && (
        <div
          style={{
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--ds-radius-lg)',
            border: '1px solid rgb(var(--np-border) / 0.6)',
            background: 'rgb(var(--np-neutral-100))',
            aspectRatio: '1 / 1.414',
            marginBottom: docTags.length ? 'var(--space-4)' : 0,
          }}
        >
          <img
            src={doc.thumbnail_url}
            alt={doc.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={e => (e.currentTarget.style.transform = '')}
          />
        </div>
      )}

      {/* Tag badges */}
      {docTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
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
              <TagIcon size={10} />
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DocumentCard;
