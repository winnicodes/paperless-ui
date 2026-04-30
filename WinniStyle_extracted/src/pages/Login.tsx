import { useState, useRef, useEffect } from 'react'
import { User, Lock, Boxes, Loader2, AlertCircle } from 'lucide-react'

export default function Login() {
  const [username,     setUsername]     = useState('')
  const [password,     setPassword]     = useState('')
  const [error,        setError]        = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const usernameRef = useRef<HTMLInputElement>(null)

  useEffect(() => { usernameRef.current?.focus() }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) { setError('Bitte einen Benutzernamen eingeben.'); return }
    if (!password.trim()) { setError('Bitte ein Passwort eingeben.');        return }
    setError(null)
    setIsSubmitting(true)
    // Demo: simuliert eine Anmeldung
    setTimeout(() => {
      setError('Ungültige Anmeldedaten. (Demo – kein echter Server)')
      setIsSubmitting(false)
    }, 1400)
  }

  const clearError = () => { if (error) setError(null) }

  return (
    <div className="login-demo">
      <section className="login-panel card-elevated" aria-labelledby="login-title">

        {/* ---- Brand ---- */}
        <header className="login-brand-block">
          <div className="login-brand-emblem" aria-hidden="true">
            <div className="login-brand-emblem-ring">
              <Boxes className="login-brand-emblem-icon" />
            </div>
          </div>
          <div className="login-brand-copy">
            <div className="login-brand-wordmark">WinniStyle</div>
            <div className="login-brand-subline">Design System</div>
          </div>
        </header>

        {/* ---- Form ---- */}
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
                placeholder="z. B. mustermann"
                value={username}
                disabled={isSubmitting}
                onChange={e => { setUsername(e.target.value); clearError() }}
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
                onChange={e => { setPassword(e.target.value); clearError() }}
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

        {/* ---- Footer ---- */}
        <footer className="login-footer">
          <p className="login-footer-line">Mein Projekt · Irgendwo GmbH</p>
          <p className="login-footer-line">WinniStyle v0.1.0 · Design System Starter</p>
        </footer>

      </section>
    </div>
  )
}
