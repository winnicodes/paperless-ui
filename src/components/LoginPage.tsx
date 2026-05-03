import { useState, useRef, useEffect } from 'react';
import { User, Lock, Loader2, AlertCircle, Sun, Moon } from 'lucide-react';
import { auth } from '../services/paperless';

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('paperless_theme') === 'dark');
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => { usernameRef.current?.focus(); }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'ember-noir' : '');
  }, [darkMode]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('paperless_theme', next ? 'dark' : 'light');
  };

  const clearError = () => { if (error) setError(null); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) { setError('Bitte einen Benutzernamen eingeben.'); return; }
    if (!password.trim()) { setError('Bitte ein Passwort eingeben.'); return; }
    setError(null);
    setIsSubmitting(true);
    try {
      const token = await auth.login(username, password);
      onLogin(token);
    } catch {
      setError('Ungültige Anmeldedaten. Bitte erneut versuchen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-demo">

      {/* Theme toggle — fixed top right */}
      <button
        className="btn btn-ghost btn-icon"
        onClick={toggleTheme}
        aria-label="Theme wechseln"
        style={{ position: 'fixed', top: 'var(--space-4)', right: 'var(--space-4)' }}
      >
        {darkMode ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      <section className="login-panel card-elevated" aria-labelledby="login-title">

        {/* Brand */}
        <header className="login-brand-block">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" style={{ width: '3rem', height: '3rem' }} className="login-logo-svg" aria-hidden="true">
            <path d="M250,0C111.9,0,0,111.9,0,250s29.8,135.5,77.5,181v-179.8c0-93.8,76.6-173.6,170.2-174.8,97-1.1,175.9,78,174.8,174.8-1.4,93.6-81.2,170.2-174.8,170.2h-43.7c-6.4,0-11.5,5.1-11.5,11.5v60.5c18.4,4.4,37.7,6.7,57.5,6.7,138.1,0,250-111.9,250-250S388.1,0,250,0Z"/>
            <path d="M204,306.4h44.6c31,0,58.2-23.7,58.9-56.3.7-32.7-27.6-59.3-58.6-58.6-31,.7-56.3,27.8-56.3,58.9v44.6c0,6.4,5.1,11.5,11.5,11.5Z"/>
          </svg>
          <div className="login-brand-copy">
            <div className="login-brand-wordmark" id="login-title">Paperless-ui</div>
            <div className="login-brand-subline">Document Browser</div>
          </div>
        </header>

        {/* Form */}
        <form className="login-form" onSubmit={submit} noValidate>
          <div className="login-field">
            <label className="login-field-label" htmlFor="login-username">
              Benutzername
            </label>
            <div className="input-group login-input-group">
              <User className="input-icon" size={16} />
              <input
                ref={usernameRef}
                className="input login-input"
                id="login-username"
                type="text"
                autoComplete="username"
                placeholder="z. B. admin"
                value={username}
                disabled={isSubmitting}
                onChange={e => { setUsername(e.target.value); clearError(); }}
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-field-label" htmlFor="login-password">
              Passwort
            </label>
            <div className="input-group login-input-group">
              <Lock className="input-icon" size={16} />
              <input
                className="input login-input"
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                disabled={isSubmitting}
                onChange={e => { setPassword(e.target.value); clearError(); }}
              />
            </div>
          </div>

          {error && (
            <p className="login-error" role="alert">
              <AlertCircle size={13} style={{ flexShrink: 0 }} />
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <><Loader2 size={16} className="spin" /> Anmeldung läuft…</>
              : 'Anmelden'
            }
          </button>
        </form>

        {/* Footer */}
        <footer className="login-footer">
          <span className="login-footer-version">v1.0.0</span>
          <a
            className="login-footer-link"
            href="https://github.com/winnicodes/paperless-ui"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="login-footer-github-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            View the Code on GitHub
          </a>
        </footer>

      </section>
    </div>
  );
}
