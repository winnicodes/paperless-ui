import { useState, useEffect, useMemo } from 'react';
import {
  Menu, X, Clock, Globe,
  LayoutGrid, List as ListIcon,
  ChevronRight, ChevronLeft,
  Search, Sun, Moon,
  Github,
  Heart,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { paperlessApi, type Document, type Tag } from './services/paperless';
import { cn } from './lib/cn';
import { useLang } from './contexts/LanguageContext';
import SidebarItem from './components/SidebarItem';
import StatRow from './components/StatRow';
import FilterBar from './components/FilterBar';
import DocumentCard from './components/DocumentCard';
import DocumentListItem from './components/DocumentListItem';
import Timeline from './components/Timeline';
import ViewerModal from './components/ViewerModal';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'timeline'>('all');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<Document | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { lang, setLang, t } = useLang();

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags =
        selectedTags.length === 0 || selectedTags.some(id => doc.tags.includes(id));
      return matchesSearch && matchesTags;
    });
  }, [documents, searchQuery, selectedTags]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, tagsRes] = await Promise.all([
          paperlessApi.getDocuments(),
          paperlessApi.getTags(),
        ]);
        setDocuments(docsRes.results);
        setTags(tagsRes.results);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.setAttribute('data-theme', next ? 'ember-noir' : '');
  };

  const toggleTag = (id: number) =>
    setSelectedTags(prev => (prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]));

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery('');
  };

  return (
    <div className={cn('app-shell', collapsed && 'collapsed')}>

      {/* ── Header ── */}
      <header className="site-header">
        <button
          className="btn btn-ghost btn-icon mobile-menu-btn"
          onClick={() => setMobileMenuOpen(o => !o)}
          aria-label="Menü"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="header-brand">
          <span className="site-logo">Paperless-ui</span>
        </div>
        <div className="header-spacer" />
        <div className="header-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setLang(lang === 'de' ? 'en' : 'de')}
            style={{ gap: 'var(--space-2)', fontWeight: 'var(--ds-weight-semibold)', fontSize: 'var(--ds-font-size-xs)', letterSpacing: '0.04em' }}
            aria-label="Sprache wechseln"
          >
            <Globe size={15} strokeWidth={1.75} />
            {lang.toUpperCase()}
          </button>
          <button className="btn btn-ghost btn-icon" onClick={toggleTheme} aria-label="Theme wechseln">
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

      </header>

      {/* ── Mobile Nav ── */}
      {mobileMenuOpen && (
        <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            <p className="mobile-nav-label">{t.navigation}</p>
            <button
              className={cn('mobile-nav-tab', activeTab === 'all' && 'active')}
              onClick={() => { setActiveTab('all'); setMobileMenuOpen(false); }}
            >
              <LayoutGrid size={16} strokeWidth={1.75} />
              {t.overview}
            </button>
            <button
              className={cn('mobile-nav-tab', activeTab === 'timeline' && 'active')}
              onClick={() => { setActiveTab('timeline'); setMobileMenuOpen(false); }}
            >
              <Clock size={16} strokeWidth={1.75} />
              {t.timeline}
            </button>

            {/* Erster Divider vor den Einstellungen */}
            <div className="mobile-nav-divider" />

            <button
              className="mobile-nav-tab"
              onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
            >
              {darkMode ? <Sun size={16} strokeWidth={1.75} /> : <Moon size={16} strokeWidth={1.75} />}
              {darkMode ? t.lightMode : t.darkMode}
            </button>
            <button
              className="mobile-nav-tab"
              onClick={() => { setLang(lang === 'de' ? 'en' : 'de'); setMobileMenuOpen(false); }}
            >
              <Globe size={16} strokeWidth={1.75} />
              {lang === 'de' ? 'English' : 'Deutsch'}
            </button>

            {/* Zweiter Divider vor den externen Links */}
            <div className="mobile-nav-divider" />

            {/* Spenden Button */}
            <button
              className="mobile-nav-tab"
              onClick={() => {
                window.open("https://deine-spendenseite.de", "_blank", "noopener,noreferrer");
                setMobileMenuOpen(false);
              }}
            >
              <Heart size={16} strokeWidth={1.75} className="text-red-500" />
              Spenden
            </button>

            {/* GitHub Button */}
            <button
              className="mobile-nav-tab"
              onClick={() => {
                window.open("https://github.com/dein-repo", "_blank", "noopener,noreferrer");
                setMobileMenuOpen(false);
              }}
            >
              <Github size={16} strokeWidth={1.75} />
              GitHub
            </button>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-group">
          <p className="sidebar-section-title">{t.navigation}</p>
          <SidebarItem
            icon={LayoutGrid}
            label={t.overview}
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          />
          <SidebarItem
            icon={Clock}
            label={t.timeline}
            active={activeTab === 'timeline'}
            onClick={() => setActiveTab('timeline')}
          />
        </div>

        {/* Schiebt alles Folgende nach ganz unten */}
        <div className="sidebar-spacer" />

        {/* 1. Spenden Button */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => window.open("https://deine-spendenseite.de", "_blank", "noopener,noreferrer")}
        >
          <Heart size={16} className="--np-danger" />
          <span className="sidebar-label">Spenden</span>
        </button>

        {/* 2. GitHub Repo Button */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => window.open("https://github.com/dein-repo", "_blank", "noopener,noreferrer")}
        >
          <Github size={16} />
          <span className="sidebar-label">GitHub</span>
        </button>

        {/* Trennlinie */}
        <div style={{
          height: '1px',
          background: 'rgb(var(--np-border) / 0.5)',
          margin: 'var(--space-2) var(--space-3)'
        }} />

        {/* 3. Collapse Button (Der eigentliche Umschalter) */}
        <button className="sidebar-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <ChevronRight className="icon-expand" size={16} />
          ) : (
            <ChevronLeft className="icon-collapse" size={16} />
          )}
          <span className="sidebar-label">{t.collapse}</span>
        </button>
      </aside>

      {/* ── Main Content ── */}
      <main className="main-content">
        <div className="main-container">

          {/* ── Page Header — tab-spezifisch ── */}
          <div className="page-header">
            <h1>{activeTab === 'all' ? t.overview : t.timeline}</h1>
            <p>{activeTab === 'all' ? t.overviewDesc : t.timelineDesc}</p>
          </div>

          {/* ── Section: Suche & Filter ── */}
          {!loading && (
            <section className="section">
              <h2 className="section-title">{t.sectionSearch}</h2>
              <FilterBar
                tags={tags}
                selectedTags={selectedTags}
                onTagToggle={toggleTag}
                onClearFilters={clearFilters}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </section>
          )}

          {/* ── Section: Kennzahlen ── */}
          {!loading && (
            <section className="section">
              <h2 className="section-title">{t.sectionStats}</h2>
              <StatRow
                total={documents.length}
                filtered={filteredDocs.length}
                tagCount={tags.length}
              />
            </section>
          )}

          {/* ── Section: Dokumente / Zeitstrahl ── */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">
                {activeTab === 'all' ? t.sectionDocs : t.timeline}
                {!loading && filteredDocs.length > 0 && (
                  <span
                    className="badge badge-secondary"
                    style={{ marginLeft: 'var(--space-3)', verticalAlign: 'middle' }}
                  >
                    {filteredDocs.length}
                  </span>
                )}
              </h2>

              {/* View-Mode-Toggle — nur Übersicht */}
              {activeTab === 'all' && !loading && (
                <div
                  className="flex"
                  style={{
                    background: 'rgb(var(--np-border) / 0.25)',
                    borderRadius: 'var(--ds-radius-md)',
                    padding: '0.2rem',
                    gap: '2px',
                  }}
                >
                  <button
                    className="btn btn-icon btn-sm"
                    style={{
                      background: viewMode === 'grid' ? 'rgb(var(--np-surface))' : 'transparent',
                      color: viewMode === 'grid' ? 'rgb(var(--np-brand-dark))' : 'rgb(var(--np-text-muted))',
                      border: 'none',
                      borderRadius: 'var(--ds-radius-sm)',
                      width: '2rem',
                      height: '2rem',
                    }}
                    onClick={() => setViewMode('grid')}
                    title={t.gridView}
                  >
                    <LayoutGrid size={16} strokeWidth={1.75} />
                  </button>
                  <button
                    className="btn btn-icon btn-sm"
                    style={{
                      background: viewMode === 'list' ? 'rgb(var(--np-surface))' : 'transparent',
                      color: viewMode === 'list' ? 'rgb(var(--np-brand-dark))' : 'rgb(var(--np-text-muted))',
                      border: 'none',
                      borderRadius: 'var(--ds-radius-sm)',
                      width: '2rem',
                      height: '2rem',
                    }}
                    onClick={() => setViewMode('list')}
                    title={t.listView}
                  >
                    <ListIcon size={16} strokeWidth={1.75} />
                  </button>
                </div>
              )}
            </div>

            {/* Inhalt */}
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-3"
                >
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="card-elevated" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      <div className="flex items-center gap-3">
                        <div className="skeleton" style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', flexShrink: 0 }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                          <div className="skeleton" style={{ height: '0.75rem', width: '60%' }} />
                          <div className="skeleton" style={{ height: '0.65rem', width: '40%' }} />
                        </div>
                      </div>
                      <div className="skeleton" style={{ height: '0.75rem', width: '100%' }} />
                      <div className="flex gap-2">
                        <div className="skeleton" style={{ height: '1.4rem', width: '3.5rem' }} />
                        <div className="skeleton" style={{ height: '1.4rem', width: '3.5rem' }} />
                      </div>
                    </div>
                  ))}
                </motion.div>

              ) : activeTab === 'timeline' ? (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Timeline documents={filteredDocs} tags={tags} onClickDoc={setViewerDoc} />
                </motion.div>

              ) : (
                <motion.div
                  key="all"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={viewMode === 'grid' ? 'grid grid-3' : ''}
                  style={viewMode === 'list' ? { display: 'flex', flexDirection: 'column' } : undefined}
                >
                  {viewMode === 'grid'
                    ? filteredDocs.map(doc => (
                      <DocumentCard key={doc.id} doc={doc} tags={tags} onClick={() => setViewerDoc(doc)} />
                    ))
                    : filteredDocs.map(doc => (
                      <DocumentListItem key={doc.id} doc={doc} tags={tags} onClick={() => setViewerDoc(doc)} />
                    ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!loading && filteredDocs.length === 0 && (
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
                  <Search size={28} style={{ color: 'rgb(var(--np-text-muted))' }} />
                </div>
                <h3 style={{ fontSize: 'var(--ds-font-size-lg)', fontWeight: 'var(--ds-weight-semibold)' }}>
                  {t.noDocsTitle}
                </h3>
                <p style={{ color: 'rgb(var(--np-text-muted))', marginTop: 'var(--space-2)' }}>
                  {t.noDocsHint}
                </p>
              </div>
            )}
          </section>

        </div>
      </main>

      {/* ── Viewer Modal ── */}
      <ViewerModal doc={viewerDoc} onClose={() => setViewerDoc(null)} />
    </div>
  );
}
