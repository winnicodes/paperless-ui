import React, { useEffect, useState } from 'react';
import { X, Server, ExternalLink, Info, RefreshCw, CheckCircle, XCircle, Loader2, Palette, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { useLang } from '../contexts/LanguageContext';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

type ConnStatus = 'idle' | 'testing' | 'ok' | 'error';

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, darkMode, toggleTheme }) => {
  const { t, lang, setLang } = useLang();
  const [paperlessUrl, setPaperlessUrl] = useState<string | null>(null);
  const [version, setVersion] = useState('—');
  const [connStatus, setConnStatus] = useState<ConnStatus>('idle');
  const [connMsg, setConnMsg] = useState('');

  const testConnection = async () => {
    setConnStatus('testing');
    setConnMsg('');
    try {
      await axios.get('/api/paperless/documents/', { params: { page_size: 1 } });
      setConnStatus('ok');
    } catch (e: any) {
      setConnStatus('error');
      setConnMsg(e.response?.status ? `HTTP ${e.response.status}` : t.settingsDisconnected);
    }
  };

  useEffect(() => {
    if (!open) return;
    axios.get('/api/config').then(res => {
      setPaperlessUrl(res.data.paperlessUrl || null);
      setVersion(res.data.version || '—');
    }).catch(() => {});
    // Auto-test on open
    testConnection();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const statusIndicator = () => {
    if (connStatus === 'testing') return <Loader2 size={13} className="settings-spin" style={{ color: 'rgb(var(--np-text-muted))' }} />;
    if (connStatus === 'ok')      return <CheckCircle size={13} style={{ color: '#22c55e', flexShrink: 0 }} />;
    if (connStatus === 'error')   return <XCircle size={13} style={{ color: '#ef4444', flexShrink: 0 }} />;
    return null;
  };

  const statusLabel = () => {
    if (connStatus === 'ok')    return <span style={{ fontSize: 'var(--ds-font-size-xs)', color: '#22c55e' }}>{t.settingsConnected}</span>;
    if (connStatus === 'error') return <span style={{ fontSize: 'var(--ds-font-size-xs)', color: '#ef4444' }}>{connMsg || t.settingsDisconnected}</span>;
    return null;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="settings-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className="settings-panel"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Mobile drag handle */}
            <div className="settings-handle" />

            {/* Header */}
            <div className="settings-header">
              <span className="settings-title">{t.settings}</span>
              <button className="btn btn-ghost btn-icon" onClick={onClose} title={t.close}>
                <X size={18} />
              </button>
            </div>

            {/* Server section */}
            <div className="settings-section">
              <p className="settings-section-label">
                <Server size={12} />
                {t.settingsServer}
              </p>

              <div className="settings-row">
                <span className="settings-row-label">{t.settingsPaperlessUrl}</span>
                {paperlessUrl ? (
                  <a href={paperlessUrl} target="_blank" rel="noopener noreferrer" className="settings-link">
                    {paperlessUrl.replace(/^https?:\/\//, '')}
                    <ExternalLink size={11} />
                  </a>
                ) : (
                  <span className="settings-value-muted">{t.settingsNotConfigured}</span>
                )}
              </div>

              <div className="settings-row">
                <span className="settings-row-label">{t.settingsConnection}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                  {statusIndicator()}
                  {statusLabel()}
                  <button
                    className="btn btn-secondary btn-icon btn-sm"
                    style={{ height: '1.75rem', width: '1.75rem' }}
                    onClick={testConnection}
                    disabled={connStatus === 'testing'}
                    title={t.settingsTest}
                  >
                    <RefreshCw size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Interface section */}
            <div className="settings-section">
              <p className="settings-section-label">
                <Palette size={12} />
                {t.settingsInterface}
              </p>

              <div className="settings-row">
                <span className="settings-row-label">{t.settingsTheme}</span>
                <div className="settings-lang-toggle">
                  <button
                    className={`settings-lang-btn${!darkMode ? ' active' : ''}`}
                    onClick={() => darkMode && toggleTheme()}
                  >
                    <Sun size={12} />
                  </button>
                  <button
                    className={`settings-lang-btn${darkMode ? ' active' : ''}`}
                    onClick={() => !darkMode && toggleTheme()}
                  >
                    <Moon size={12} />
                  </button>
                </div>
              </div>

              <div className="settings-row">
                <span className="settings-row-label">{t.settingsLanguage}</span>
                <div className="settings-lang-toggle">
                  <button
                    className={`settings-lang-btn${lang === 'de' ? ' active' : ''}`}
                    onClick={() => setLang('de')}
                  >
                    DE
                  </button>
                  <button
                    className={`settings-lang-btn${lang === 'en' ? ' active' : ''}`}
                    onClick={() => setLang('en')}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>

            {/* About section */}
            <div className="settings-section">
              <p className="settings-section-label">
                <Info size={12} />
                {t.settingsAbout}
              </p>

              <div className="settings-row">
                <span className="settings-row-label">{t.settingsVersion}</span>
                <span className="settings-value">v{version}</span>
              </div>

              <div className="settings-row">
                <span className="settings-row-label">GitHub</span>
                <a
                  href="https://github.com/winnicodes/paperless-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="settings-link"
                >
                  {t.settingsGitHub}
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
