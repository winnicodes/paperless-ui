import React, { useEffect } from 'react';
import { FileText, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { type Document } from '../services/paperless';
import { useLang } from '../contexts/LanguageContext';

interface ViewerModalProps {
  doc: Document | null;
  onClose: () => void;
}

const ViewerModal: React.FC<ViewerModalProps> = ({ doc, onClose }) => {
  const { t } = useLang();
  useEffect(() => {
    if (doc) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [doc]);

  return (
  <AnimatePresence>
    {doc && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-5)',
          background: 'rgb(0 0 0 / 0.6)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '72rem',
            borderRadius: 'var(--ds-radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'rgb(var(--np-surface))',
            boxShadow: '0 24px 64px -16px rgb(0 0 0 / 0.6)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Modal header */}
          <div
            style={{
              height: '3.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 var(--space-6)',
              borderBottom: '1px solid rgb(var(--np-border) / 0.5)',
              background: 'rgb(var(--np-header))',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
              <FileText size={18} style={{ color: 'rgb(var(--np-brand-dark))', flexShrink: 0 }} />
              <span
                style={{
                  fontWeight: 'var(--ds-weight-semibold)',
                  fontSize: 'var(--ds-font-size-sm)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '32rem',
                }}
              >
                {doc.title}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
              {doc.download_url && (
                <a
                  href={doc.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-icon"
                  title={t.download}
                >
                  <Download size={18} />
                </a>
              )}
              <button className="btn btn-ghost btn-icon" onClick={onClose} title={t.close}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* PDF via Proxy-iframe */}
          <div style={{ flex: 1, background: '#1e1e1e', minHeight: 0 }}>
            {doc.download_url ? (
              <iframe
                src={`${doc.download_url}#toolbar=1&navpanes=0`}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                title={doc.title}
              />
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'rgb(var(--np-text-muted))',
                fontSize: 'var(--ds-font-size-sm)',
              }}>
                {t.noPreview}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
};

export default ViewerModal;
