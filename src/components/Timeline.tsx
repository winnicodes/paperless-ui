import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'motion/react';
import { type Document, type Tag } from '../services/paperless';
import DocumentCard from './DocumentCard';
import { useLang } from '../contexts/LanguageContext';

interface TimelineProps {
  documents: Document[];
  tags: Tag[];
  onClickDoc: (doc: Document) => void;
  darkMode: boolean;
  onRename?: (id: number, newTitle: string) => Promise<void>;
}

const SPINE_CENTER = 10; // px from container left edge to spine center
const CONTAINER_INDENT = 36; // px of padding-left on the container

const Timeline: React.FC<TimelineProps> = ({ documents, tags, onClickDoc, darkMode, onRename }) => {
  const { t } = useLang();

  const groups = useMemo(() => {
    const sorted = [...documents].sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );
    const result: { key: string; docs: Document[] }[] = [];
    const index: Record<string, number> = {};
    sorted.forEach(doc => {
      const key = format(parseISO(doc.created), 'yyyy-MM');
      if (index[key] === undefined) {
        index[key] = result.length;
        result.push({ key, docs: [] });
      }
      result[index[key]].docs.push(doc);
    });
    return result;
  }, [documents]);

  if (documents.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-20) 0' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '4rem',
            height: '4rem',
            borderRadius: '50%',
            background: 'rgb(var(--np-border) / 0.3)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <Clock size={28} style={{ color: 'rgb(var(--np-text-muted))' }} />
        </div>
        <p style={{ color: 'rgb(var(--np-text-muted))', fontStyle: 'italic' }}>
          {t.timelineEmpty}
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', paddingLeft: `${CONTAINER_INDENT}px` }}>

      {/* Vertical spine */}
      <div
        style={{
          position: 'absolute',
          left: `${SPINE_CENTER}px`,
          top: '0.5rem',
          bottom: '0.5rem',
          width: '2px',
          background: 'rgb(var(--np-border))',
          borderRadius: '1px',
        }}
      />

      {groups.map(({ key, docs }, idx) => {
        const date = parseISO(`${key}-01`);
        const isFirst = idx === 0;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            style={{ position: 'relative', marginBottom: 'var(--space-10)' }}
          >
            {/* Dot on spine */}
            <div
              style={{
                position: 'absolute',
                left: `${SPINE_CENTER - CONTAINER_INDENT - 7}px`,
                top: '0.5rem',
                transform: 'translateY(-50%)',
                width: '0.875rem',
                height: '0.875rem',
                borderRadius: '50%',
                background: isFirst ? 'rgb(var(--np-brand))' : 'rgb(var(--np-border))',
                border: '2px solid rgb(var(--np-surface))',
                boxShadow: isFirst ? '0 0 0 3px rgb(var(--np-brand) / 0.2)' : 'none',
              }}
            />

            {/* Month + Year header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-5)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--ds-font-size-md)',
                  fontWeight: 'var(--ds-weight-bold)',
                  color: 'rgb(var(--np-text-main))',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                }}
              >
                {format(date, 'MMMM', { locale: t.dateLocale })}
              </span>
              <span
                style={{
                  fontSize: 'var(--ds-font-size-md)',
                  fontWeight: 'var(--ds-weight-semibold)',
                  color: 'rgb(var(--np-text-muted))',
                  lineHeight: 1,
                }}
              >
                {format(date, 'yyyy')}
              </span>
            </div>

            {/* Document cards — full width */}
            <div className="grid grid-auto">
              {docs.map(doc => (
                <DocumentCard
                  key={doc.id}
                  doc={doc}
                  tags={tags}
                  onClick={() => onClickDoc(doc)}
                  darkMode={darkMode}
                  onRename={onRename}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Timeline;
