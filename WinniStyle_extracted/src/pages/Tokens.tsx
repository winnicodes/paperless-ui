const SPACING = [
  { token: '--space-1',  rem: '0.25rem', px: 4 },
  { token: '--space-2',  rem: '0.5rem',  px: 8 },
  { token: '--space-3',  rem: '0.75rem', px: 12 },
  { token: '--space-4',  rem: '1rem',    px: 16 },
  { token: '--space-5',  rem: '1.25rem', px: 20 },
  { token: '--space-6',  rem: '1.5rem',  px: 24 },
  { token: '--space-8',  rem: '2rem',    px: 32 },
  { token: '--space-10', rem: '2.5rem',  px: 40 },
  { token: '--space-12', rem: '3rem',    px: 48 },
  { token: '--space-16', rem: '4rem',    px: 64 },
  { token: '--space-20', rem: '5rem',    px: 80 },
]

const FONT_SIZES = [
  { token: '--ds-font-size-2xs', rem: '0.6875rem' },
  { token: '--ds-font-size-xs',  rem: '0.75rem'   },
  { token: '--ds-font-size-sm',  rem: '0.875rem'  },
  { token: '--ds-font-size-md',  rem: '1rem'      },
  { token: '--ds-font-size-lg',  rem: '1.125rem'  },
  { token: '--ds-font-size-xl',  rem: '1.25rem'   },
  { token: '--ds-font-size-2xl', rem: '1.5rem'    },
  { token: '--ds-font-size-3xl', rem: '1.875rem'  },
]

const FONT_WEIGHTS = [
  { token: '--ds-weight-regular',  value: '400' },
  { token: '--ds-weight-medium',   value: '500' },
  { token: '--ds-weight-semibold', value: '600' },
  { token: '--ds-weight-bold',     value: '700' },
]

const RADII = [
  { token: '--ds-radius-sm', rem: '0.375rem' },
  { token: '--ds-radius-md', rem: '0.5rem'   },
  { token: '--ds-radius-lg', rem: '0.625rem' },
  { token: '--ds-radius-xl', rem: '0.75rem'  },
]

const SHADOWS = [
  { token: '--ds-shadow-panel',  label: 'Panel'  },
  { token: '--ds-shadow-raised', label: 'Raised' },
]

const COLORS_SEMANTIC = [
  { token: '--np-brand',   label: 'Brand'   },
  { token: '--np-success', label: 'Success' },
  { token: '--np-warning', label: 'Warning' },
  { token: '--np-danger',  label: 'Danger'  },
  { token: '--np-info',    label: 'Info'    },
]

const COLORS_PRIMARY = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
const COLORS_NEUTRAL = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

const DURATIONS = [
  { token: '--ds-duration-fast', value: '120ms' },
  { token: '--ds-duration-base', value: '180ms' },
  { token: '--ds-duration-slow', value: '280ms' },
]

const EASINGS = [
  { token: '--ds-ease-standard',   value: 'cubic-bezier(0.2, 0, 0, 1)'    },
  { token: '--ds-ease-emphasized', value: 'cubic-bezier(0.22, 1, 0.36, 1)' },
]

export default function Tokens() {
  return (
    <>
      <div className="page-header">
        <h1>Tokens</h1>
        <p>Designentscheidungen als CSS-Variablen – Abstände, Typografie, Farben und mehr.</p>
      </div>

      <section className="section">
        <h2 className="section-title">Spacing</h2>
        <div className="card">
          <div className="token-scale">
            {SPACING.map(({ token, rem, px }) => (
              <div className="token-scale-row" key={token}>
                <code className="token-name">{token}</code>
                <span className="token-val">{rem} · {px}px</span>
                <div className="token-bar-track">
                  <div className="token-bar" style={{ width: px * 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Typografie</h2>
        <div className="card">
          <p className="token-sub-label">Schriftgrößen</p>
          <div className="token-scale">
            {FONT_SIZES.map(({ token, rem }) => (
              <div className="token-scale-row" key={token}>
                <code className="token-name">{token}</code>
                <span className="token-val">{rem}</span>
                <span style={{ fontSize: `var(${token})`, lineHeight: 1.2 }}>
                  Schriftgröße · The quick brown fox
                </span>
              </div>
            ))}
          </div>
          <p className="token-sub-label" style={{ marginTop: 'var(--space-6)' }}>Schriftgewichte</p>
          <div className="token-scale">
            {FONT_WEIGHTS.map(({ token, value }) => (
              <div className="token-scale-row" key={token}>
                <code className="token-name">{token}</code>
                <span className="token-val">{value}</span>
                <span style={{ fontWeight: `var(${token})` }}>
                  WinniStyle Design System
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Farben</h2>
        <div className="card">
          <p className="token-sub-label">Semantisch</p>
          <div className="token-swatch-row">
            {COLORS_SEMANTIC.map(({ token, label }) => (
              <div className="token-swatch-item" key={token}>
                <div className="token-swatch" style={{ background: `rgb(var(${token}))` }} />
                <code>{token}</code>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <p className="token-sub-label" style={{ marginTop: 'var(--space-6)' }}>Primary</p>
          <div className="token-swatch-row">
            {COLORS_PRIMARY.map(step => (
              <div className="token-swatch-item" key={step}>
                <div className="token-swatch" style={{ background: `rgb(var(--np-primary-${step}))` }} />
                <code>--np-primary-{step}</code>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <p className="token-sub-label" style={{ marginTop: 'var(--space-6)' }}>Neutral</p>
          <div className="token-swatch-row">
            {COLORS_NEUTRAL.map(step => (
              <div className="token-swatch-item" key={step}>
                <div className="token-swatch" style={{ background: `rgb(var(--np-neutral-${step}))` }} />
                <code>--np-neutral-{step}</code>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Border Radii</h2>
        <div className="card">
          <div className="token-radii-row">
            {RADII.map(({ token, rem }) => (
              <div className="token-radii-item" key={token}>
                <div className="token-radii-box" style={{ borderRadius: `var(${token})` }} />
                <code>{token}</code>
                <span>{rem}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Schatten</h2>
        <div className="token-shadow-row">
          {SHADOWS.map(({ token, label }) => (
            <div className="token-shadow-item" key={token}>
              <div className="token-shadow-box" style={{ boxShadow: `var(${token})` }} />
              <code>{token}</code>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Motion</h2>
        <div className="card">
          <p className="token-sub-label">Durations</p>
          <div className="token-scale">
            {DURATIONS.map(({ token, value }) => (
              <div className="token-scale-row" key={token}>
                <code className="token-name">{token}</code>
                <span className="token-val">{value}</span>
                <div className="token-duration-demo" style={{ animationDuration: value }} />
              </div>
            ))}
          </div>
          <p className="token-sub-label" style={{ marginTop: 'var(--space-6)' }}>Easings</p>
          <div className="token-scale">
            {EASINGS.map(({ token, value }) => (
              <div className="token-scale-row token-scale-row--2col" key={token}>
                <code className="token-name">{token}</code>
                <code className="token-val token-val--mono">{value}</code>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
