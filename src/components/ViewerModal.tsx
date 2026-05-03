import React, { useEffect, useState, useCallback, useRef } from "react";
import { FileText, Download, X, ChevronLeft, ChevronRight, Pencil, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

// Pfade zu deinen Kontexten/Services
import { type Document as PaperlessDoc } from "../services/paperless";
import { useLang } from "../contexts/LanguageContext";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const ViewerModal: React.FC<{
  doc: PaperlessDoc | null;
  onClose: () => void;
  onRename?: (id: number, newTitle: string) => Promise<void>;
}> = ({ doc, onClose, onRename }) => {
  const { t } = useLang();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pdfReady, setPdfReady] = useState(false);
  const [containerHeight, setContainerHeight] = useState(0);

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [saving, setSaving] = useState(false);
  const saveRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const transformComponentRef = useRef<any>(null);

  const startEdit = useCallback(() => {
    if (!doc || !onRename) return;
    setInputValue(doc.title);
    setEditing(true);
    saveRef.current = false;
    setTimeout(() => { inputRef.current?.select(); }, 0);
  }, [doc, onRename]);

  const save = useCallback(async () => {
    if (saveRef.current || !doc) return;
    saveRef.current = true;
    const trimmed = inputValue.trim();
    if (!trimmed || trimmed === doc.title) { setEditing(false); return; }
    setSaving(true);
    try { await onRename?.(doc.id, trimmed); }
    finally { setSaving(false); setEditing(false); }
  }, [inputValue, doc, onRename]);

  const cancel = useCallback(() => { saveRef.current = true; setEditing(false); }, []);

  // Überwacht die Größe des Containers für responsives PDF-Scaling
  useEffect(() => {
    if (!doc || !containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      setContainerHeight(entries[0].contentRect.height);
    });
    observer.observe(containerRef.current);
    setContainerHeight(containerRef.current.clientHeight);
    return () => observer.disconnect();
  }, [doc]);

  // Reset bei Dokumentwechsel
  useEffect(() => {
    setPdfReady(false);
    setPage(1);
    setNumPages(null);
  }, [doc]);

  const handleDownload = useCallback(async () => {
    if (!doc?.download_url) return;
    try {
      const res = await axios.get(doc.download_url, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.title.endsWith('.pdf') ? doc.title : `${doc.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) { console.error("Download failed", e); }
  }, [doc]);

  const changePage = (newPage: number) => {
    if (newPage === page) return;
    // Wir setzen pdfReady auf false, damit sofort das Thumbnail als Platzhalter erscheint
    setPdfReady(false);
    setPage(newPage);
    // Zoom beim Umblättern zurücksetzen für bessere UX
    if (transformComponentRef.current) {
      transformComponentRef.current.resetTransform();
    }
  };

  return (
    <AnimatePresence>
      {doc && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000, display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: 'var(--space-5)',
            background: 'rgb(0 0 0 / 0.6)', backdropFilter: 'blur(4px)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
            style={{
              width: '100%', height: '100%', maxWidth: '72rem',
              borderRadius: 'var(--ds-radius-xl)', display: 'flex', flexDirection: 'column',
              overflow: 'hidden', background: 'rgb(var(--np-surface))',
              boxShadow: '0 24px 64px -16px rgb(0 0 0 / 0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Titel links, Actions (Download, X) rechts */}
            <div style={{
              height: '3.5rem', flexShrink: 0, display: 'flex',
              alignItems: 'center', padding: '0 var(--space-3)',
              borderBottom: '1px solid rgb(var(--np-border) / 0.5)',
              background: 'rgb(var(--np-header))', gap: 'var(--space-2)',
              zIndex: 20
            }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <FileText size={16} style={{ color: 'rgb(var(--np-brand-dark))', flexShrink: 0 }} />
                {editing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flex: 1 }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', minWidth: 0 }}>
                    <span style={{
                      fontWeight: 'var(--ds-weight-semibold)', fontSize: 'var(--ds-font-size-sm)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {doc.title}
                    </span>
                    {onRename && (
                      <button className="rename-btn" style={{ opacity: 1 }} onClick={startEdit} title={t.renameDoc}>
                        <Pencil size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <button className="btn btn-ghost btn-icon" onClick={handleDownload} title={t.download}>
                  <Download size={18} />
                </button>
                <button className="btn btn-ghost btn-icon" onClick={onClose}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Viewport mit Zoom & Thumbnail-Overlay */}
            <div 
              ref={containerRef}
              style={{
                flex: 1, background: 'rgb(var(--np-background))', 
                position: 'relative', overflow: 'hidden', touchAction: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {/* Thumbnail als Platzhalter (immer da, wenn PDF noch rendert) */}
              {!pdfReady && doc.thumbnail_url && (
                <img 
                  src={doc.thumbnail_url} 
                  alt="Pre-rendering..." 
                  style={{ 
                    position: 'absolute', 
                    height: containerHeight * 0.9, 
                    objectFit: 'contain',
                    filter: 'blur(8px)',
                    opacity: 0.5,
                    transition: 'opacity 0.3s ease'
                  }} 
                />
              )}

              <TransformWrapper
                ref={transformComponentRef}
                initialScale={1} 
                minScale={1} 
                maxScale={6}
                centerOnInit 
                limitToBounds={true} // Verhindert das Rauszoomen ins Leere
              >
                <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }} contentStyle={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Document
                    file={doc.download_url}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={null} // Wir nutzen unser eigenes Thumbnail-System statt Spinner
                  >
                    <div style={{ 
                      background: 'white', 
                      boxShadow: '0 10px 30px -10px rgb(0 0 0 / 0.5)',
                      lineHeight: 0,
                      opacity: pdfReady ? 1 : 0, // Versteckt das unfertige SVG
                      transition: 'opacity 0.15s ease-in'
                    }}>
                      <Page
                        key={`page-${page}`} // Sorgt für sauberes Re-Rendering bei Seitenwechsel
                        pageNumber={page}
                        height={containerHeight > 0 ? containerHeight * 0.9 : undefined}

                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        onRenderSuccess={() => setPdfReady(true)}
                      />
                    </div>
                  </Document>
                </TransformComponent>
              </TransformWrapper>
            </div>

            {/* Footer Navigation */}
            {numPages && numPages > 1 && (
              <div style={{
                height: '3.5rem', flexShrink: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)',
                borderTop: '1px solid rgb(var(--np-border) / 0.5)',
                background: 'rgb(var(--np-header))', zIndex: 20
              }}>
                <button 
                  className="btn btn-ghost btn-icon" 
                  onClick={() => changePage(page - 1)} 
                  disabled={page <= 1}
                >
                  <ChevronLeft size={20} />
                </button>
                <span style={{ 
                  fontSize: 'var(--ds-font-size-xs)', 
                  color: 'rgb(var(--np-text-muted))', 
                  minWidth: '4rem', 
                  textAlign: 'center',
                  fontWeight: '500'
                }}>
                  {page} / {numPages}
                </span>
                <button 
                  className="btn btn-ghost btn-icon" 
                  onClick={() => changePage(page + 1)} 
                  disabled={page >= numPages}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewerModal;