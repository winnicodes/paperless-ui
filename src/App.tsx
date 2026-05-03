import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Menu, X, Clock,
  LayoutGrid, List as ListIcon,
  ChevronRight, ChevronLeft,
  Search, ArrowUp,
  LogOut, Heart, Settings2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { paperlessApi, auth, type Document, type Tag } from './services/paperless';
import { cn } from './lib/cn';
import { useLang } from './contexts/LanguageContext';
import SidebarItem from './components/SidebarItem';
import FilterBar from './components/FilterBar';
import DocumentCard from './components/DocumentCard';
import DocumentListItem from './components/DocumentListItem';
import Timeline from './components/Timeline';
import ViewerModal from './components/ViewerModal';
import SettingsModal from './components/SettingsModal';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'timeline'>(() => {
    const saved = localStorage.getItem('paperless_tab');
    return saved === 'timeline' ? 'timeline' : 'all';
  });
  const [documents, setDocuments] = useState<Document[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('paperless_theme') === 'dark');
  const [viewerDoc, setViewerDoc] = useState<Document | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { t } = useLang();

  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);
  const filtersRef = useRef({ searchQuery, selectedTags });
  const mainRef = useRef<HTMLElement>(null);
  const scrollPositions = useRef<Record<string, number>>({});

  const switchTab = (tab: 'all' | 'timeline') => {
    if (mainRef.current) scrollPositions.current[activeTab] = mainRef.current.scrollTop;
    setActiveTab(tab);
    localStorage.setItem('paperless_tab', tab);
  };

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = scrollPositions.current[activeTab] ?? 0;
  }, [activeTab]);

  useEffect(() => { filtersRef.current = { searchQuery, selectedTags }; }, [searchQuery, selectedTags]);

  // Fetch tags once
  useEffect(() => {
    paperlessApi.getTags().then(res => setTags(res.results));
  }, []);

  // Reset + re-fetch when filters change (search debounced)
  useEffect(() => {
    let cancelled = false;
    const doFetch = async () => {
      setLoading(true);
      pageRef.current = 1;
      const params: Record<string, unknown> = { page: 1, page_size: 10 };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedTags.length > 0) params['tags__id__in'] = selectedTags.join(',');
      const result = await paperlessApi.getDocuments(params);
      if (!cancelled) {
        setDocuments(result.results);
        setTotalCount(result.count);
        setHasMore(result.hasMore);
        setLoading(false);
      }
    };
    const timer = setTimeout(doFetch, searchQuery.trim() ? 300 : 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [searchQuery, selectedTags]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;
    const { searchQuery: sq, selectedTags: st } = filtersRef.current;
    const params: Record<string, unknown> = { page: nextPage, page_size: 10 };
    if (sq.trim()) params.search = sq.trim();
    if (st.length > 0) params['tags__id__in'] = st.join(',');
    const result = await paperlessApi.getDocuments(params);
    pageRef.current = nextPage;
    setDocuments(prev => [...prev, ...result.results]);
    setTotalCount(result.count);
    setHasMore(result.hasMore);
    setLoadingMore(false);
  }, [loadingMore, hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: '600px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'ember-noir' : '');
  }, [darkMode]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 400);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('paperless_theme', next ? 'dark' : 'light');
  };

  const toggleTag = (id: number) =>
    setSelectedTags(prev => (prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]));

  const handleRename = async (id: number, newTitle: string) => {
    await paperlessApi.patchDocument(id, { title: newTitle });
    setDocuments(docs => docs.map(d => d.id === id ? { ...d, title: newTitle } : d));
    setViewerDoc(prev => prev?.id === id ? { ...prev, title: newTitle } : prev);
  };

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
          <button className="btn btn-ghost btn-icon" onClick={() => setSettingsOpen(true)} aria-label={t.settings}>
            <Settings2 size={18} />
          </button>
          <button className="btn btn-ghost btn-icon" onClick={() => { auth.logout(); window.location.reload(); }} aria-label="Abmelden">
            <LogOut size={18} />
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
              onClick={() => { switchTab('all'); setMobileMenuOpen(false); }}
            >
              <LayoutGrid size={16} strokeWidth={1.75} />
              {t.overview}
            </button>
            <button
              className={cn('mobile-nav-tab', activeTab === 'timeline' && 'active')}
              onClick={() => { switchTab('timeline'); setMobileMenuOpen(false); }}
            >
              <Clock size={16} strokeWidth={1.75} />
              {t.timeline}
            </button>

            {/* Spenden Button */}
            <div className="mobile-nav-divider" />
            <button
              className="mobile-nav-tab"
              onClick={() => {
                window.open("https://ko-fi.com/winnicodes", "_blank", "noopener,noreferrer");
                setMobileMenuOpen(false);
              }}
            >
              <Heart size={16} strokeWidth={0} fill="#ef4444" />
              {t.donate}
            </button>

            {/* Divider + Einstellungen + Logout */}
            <div className="mobile-nav-divider" />
            <button
              className="mobile-nav-tab"
              onClick={() => { setSettingsOpen(true); setMobileMenuOpen(false); }}
            >
              <Settings2 size={16} strokeWidth={1.75} />
              {t.settings}
            </button>
            <button
              className="mobile-nav-tab"
              onClick={() => { auth.logout(); window.location.reload(); }}
            >
              <LogOut size={16} strokeWidth={1.75} />
              {t.logout}
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
            onClick={() => switchTab('all')}
          />
          <SidebarItem
            icon={Clock}
            label={t.timeline}
            active={activeTab === 'timeline'}
            onClick={() => switchTab('timeline')}
          />
        </div>

        {/* Schiebt alles Folgende nach ganz unten */}
        <div className="sidebar-spacer" />

        {/* Spenden Button */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => window.open("https://ko-fi.com/winnicodes", "_blank", "noopener,noreferrer")}
        >
          <Heart size={16} strokeWidth={0} fill="#ef4444" />
          <span className="sidebar-label">{t.donate}</span>
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
      <main className="main-content" ref={mainRef}>
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
                darkMode={darkMode}
              />
            </section>
          )}


          {/* ── Section: Dokumente / Zeitstrahl ── */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">
                {activeTab === 'all' ? t.sectionDocs : t.timeline}
                {!loading && totalCount > 0 && (
                  <span
                    className="badge badge-secondary"
                    style={{ marginLeft: 'var(--space-3)', verticalAlign: 'middle' }}
                  >
                    {totalCount}
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
                  className="grid grid-auto"
                >
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="card-elevated" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                      {/* Avatar + Titel + Datum */}
                      <div className="flex items-center gap-3">
                        <div className="skeleton" style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', flexShrink: 0 }} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                          <div className="skeleton" style={{ height: '0.75rem', width: '60%' }} />
                          <div className="skeleton" style={{ height: '0.65rem', width: '35%' }} />
                        </div>
                      </div>
                      {/* Vorschaubild (A4-Verhältnis) */}
                      <div className="skeleton" style={{ width: '100%', aspectRatio: '1 / 1.414', borderRadius: 'var(--ds-radius-lg)' }} />
                      {/* Tag-Badges */}
                      <div className="flex gap-2">
                        <div className="skeleton" style={{ height: '1.4rem', width: '3.5rem', borderRadius: '99px' }} />
                        <div className="skeleton" style={{ height: '1.4rem', width: '4.5rem', borderRadius: '99px' }} />
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
                  <Timeline documents={documents} tags={tags} onClickDoc={setViewerDoc} darkMode={darkMode} onRename={handleRename} />
                </motion.div>

              ) : (
                <motion.div
                  key="all"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={viewMode === 'grid' ? 'grid grid-auto' : undefined}
                >
                  {viewMode === 'grid'
                    ? documents.map(doc => (
                      <DocumentCard key={doc.id} doc={doc} tags={tags} onClick={() => setViewerDoc(doc)} darkMode={darkMode} onRename={handleRename} />
                    ))
                    : (
                      <div className="table-wrapper">
                        <table>
                          <thead>
                            <tr>
                              <th>{t.colDocument}</th>
                              <th>{t.colDate}</th>
                              <th>{t.colTags}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {documents.map(doc => (
                              <DocumentListItem key={doc.id} doc={doc} tags={tags} onClick={() => setViewerDoc(doc)} darkMode={darkMode} onRename={handleRename} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  }
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sentinel + load-more indicator */}
            {!loading && (
              <div ref={sentinelRef} style={{ height: '1px' }} />
            )}
            {loadingMore && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-6) 0' }}>
                <div className="skeleton" style={{ width: '6rem', height: '0.75rem', borderRadius: '999px' }} />
              </div>
            )}

            {/* Empty State */}
            {!loading && documents.length === 0 && (
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

      {/* ── Scroll-to-top Button ── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'fixed', bottom: 'var(--space-6)', right: 'var(--space-6)',
              zIndex: 900, width: '2.75rem', height: '2.75rem',
              borderRadius: '50%', border: '1px solid rgb(var(--np-border))',
              background: 'rgb(var(--np-surface))',
              color: 'rgb(var(--np-text-muted))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgb(0 0 0 / 0.15)',
            }}
            aria-label="Nach oben"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Settings Modal ── */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} darkMode={darkMode} toggleTheme={toggleTheme} />

      {/* ── Viewer Modal ── */}
      <ViewerModal doc={viewerDoc} onClose={() => setViewerDoc(null)} onRename={handleRename} />
    </div>
  );
}
