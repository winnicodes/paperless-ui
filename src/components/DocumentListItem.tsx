import React, { useMemo } from 'react';
import { FileText, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion } from 'motion/react';
import { type Document, type Tag } from '../services/paperless';
import { useLang } from '../contexts/LanguageContext';

interface DocumentListItemProps {
  doc: Document;
  tags: Tag[];
  onClick: () => void;
}

const DocumentListItem: React.FC<DocumentListItemProps> = ({ doc, tags, onClick }) => {
  const { t } = useLang();
  const docTags = useMemo(() => tags.filter(tag => doc.tags?.includes(tag.id)), [doc.tags, tags]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="component-tile mb-2"
      onClick={onClick}
    >
      {/* Icon */}
      <div className="component-tile-icon">
        <div className="avatar" style={{ background: 'rgb(var(--np-brand) / 0.15)', color: 'rgb(var(--np-brand-dark))' }}>
          <FileText size={16} />
        </div>
      </div>

      {/* Title + date */}
      <div className="flex-1 min-w-0">
        <div className="component-tile-label">{doc.title}</div>
        <div
          className="flex items-center gap-1 mt-0.5"
          style={{ fontSize: 'var(--ds-font-size-xs)', color: 'rgb(var(--np-text-muted))' }}
        >
          <Calendar size={11} />
          {format(parseISO(doc.created), t.dateFormat, { locale: t.dateLocale })}
        </div>
      </div>

      {/* Tags */}
      {docTags.length > 0 && (
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end" style={{ maxWidth: '200px' }}>
          {docTags.map(tag => (
            <span
              key={tag.id}
              className="badge"
              style={{
                backgroundColor: `${tag.color}15`,
                borderColor: `${tag.color}30`,
                color: tag.color,
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DocumentListItem;
