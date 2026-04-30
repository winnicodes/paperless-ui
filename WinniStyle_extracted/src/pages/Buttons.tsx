import type { ReactNode } from 'react'
import {
  ArrowRight,
  Check,
  Ellipsis,
  Loader2,
  Pencil,
  Plus,
  Share2,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react'
import { CodeSnippet } from '../components/ui/CodeSnippet'

interface ButtonExample {
  title: string
  description: string
  tokens: string[]
  preview: ReactNode
  code: string
}

interface ButtonSection {
  title: string
  examples: ButtonExample[]
}

const BUTTON_SECTIONS: ButtonSection[] = [
  {
    title: 'Varianten',
    examples: [
      {
        title: 'Primary',
        description: 'Für die wichtigste Aktion in einem Bereich.',
        tokens: ['btn', 'btn-primary'],
        preview: <button className="btn btn-primary"><Check size={14} /> Speichern</button>,
        code: `<button className="btn btn-primary">
  <Check size={14} />
  Speichern
</button>`,
      },
      {
        title: 'Secondary',
        description: 'Für neutrale Aktionen neben oder unter Primary-Actions.',
        tokens: ['btn', 'btn-secondary'],
        preview: <button className="btn btn-secondary"><SlidersHorizontal size={14} /> Filter</button>,
        code: `<button className="btn btn-secondary">
  <SlidersHorizontal size={14} />
  Filter
</button>`,
      },
      {
        title: 'Ghost',
        description: 'Für zurückhaltende Aktionen ohne visuelles Gewicht.',
        tokens: ['btn', 'btn-ghost'],
        preview: <button className="btn btn-ghost"><Share2 size={14} /> Teilen</button>,
        code: `<button className="btn btn-ghost">
  <Share2 size={14} />
  Teilen
</button>`,
      },
      {
        title: 'Danger',
        description: 'Für destruktive oder riskante Aktionen.',
        tokens: ['btn', 'btn-danger'],
        preview: <button className="btn btn-danger"><Trash2 size={14} /> Löschen</button>,
        code: `<button className="btn btn-danger">
  <Trash2 size={14} />
  Löschen
</button>`,
      },
    ],
  },
  {
    title: 'Größen',
    examples: [
      {
        title: 'Small',
        description: 'Für Toolbars, Tabellenzeilen und kompakte Karten.',
        tokens: ['btn', 'btn-sm', 'btn-primary'],
        preview: <button className="btn btn-sm btn-primary">Klein</button>,
        code: `<button className="btn btn-sm btn-primary">
  Klein
</button>`,
      },
      {
        title: 'Default',
        description: 'Standardgröße für Formulare, Dialoge und Seitenaktionen.',
        tokens: ['btn', 'btn-primary'],
        preview: <button className="btn btn-primary">Standard</button>,
        code: `<button className="btn btn-primary">
  Standard
</button>`,
      },
      {
        title: 'Large',
        description: 'Für prominente Aktionen in luftigen Bereichen.',
        tokens: ['btn', 'btn-lg', 'btn-primary'],
        preview: <button className="btn btn-lg btn-primary">Groß</button>,
        code: `<button className="btn btn-lg btn-primary">
  Groß
</button>`,
      },
    ],
  },
  {
    title: 'Icon-Patterns',
    examples: [
      {
        title: 'Leading Icon',
        description: 'Icon links, wenn es die Aktion schneller erkennbar macht.',
        tokens: ['btn', 'btn-primary'],
        preview: <button className="btn btn-primary"><Plus size={14} /> Neu erstellen</button>,
        code: `<button className="btn btn-primary">
  <Plus size={14} />
  Neu erstellen
</button>`,
      },
      {
        title: 'Trailing Icon',
        description: 'Icon rechts für Weiter-, Öffnen- oder Navigationsaktionen.',
        tokens: ['btn', 'btn-secondary'],
        preview: <button className="btn btn-secondary">Weiter <ArrowRight size={14} /></button>,
        code: `<button className="btn btn-secondary">
  Weiter
  <ArrowRight size={14} />
</button>`,
      },
      {
        title: 'Icon-only · Secondary',
        description: 'Für bekannte Toolbar-Aktionen. Immer mit aria-label nutzen.',
        tokens: ['btn', 'btn-secondary', 'btn-icon'],
        preview: <button className="btn btn-secondary btn-icon" data-tooltip="Bearbeiten" aria-label="Bearbeiten"><Pencil size={14} /></button>,
        code: `<button
  className="btn btn-secondary btn-icon"
  aria-label="Bearbeiten"
  data-tooltip="Bearbeiten"
>
  <Pencil size={14} />
</button>`,
      },
      {
        title: 'Icon-only · Ghost',
        description: 'Für zurückhaltende Toolbar-Aktionen ohne visuelles Gewicht.',
        tokens: ['btn', 'btn-ghost', 'btn-icon'],
        preview: <button className="btn btn-ghost btn-icon" data-tooltip="Mehr" aria-label="Mehr"><Ellipsis size={14} /></button>,
        code: `<button
  className="btn btn-ghost btn-icon"
  aria-label="Mehr"
  data-tooltip="Mehr"
>
  <Ellipsis size={14} />
</button>`,
      },
    ],
  },
  {
    title: 'Zustände',
    examples: [
      {
        title: 'Disabled',
        description: 'Wenn eine Aktion sichtbar, aber aktuell nicht verfügbar ist.',
        tokens: ['btn', 'btn-primary', 'disabled'],
        preview: <button className="btn btn-primary" disabled>Deaktiviert</button>,
        code: `<button className="btn btn-primary" disabled>
  Deaktiviert
</button>`,
      },
      {
        title: 'Loading',
        description: 'Wenn eine ausgelöste Aktion gerade verarbeitet wird.',
        tokens: ['btn', 'btn-primary', 'spin'],
        preview: <button className="btn btn-primary"><Loader2 size={14} className="spin" /> Lädt...</button>,
        code: `<button className="btn btn-primary" disabled>
  <Loader2 size={14} className="spin" />
  Lädt...
</button>`,
      },
    ],
  },
]

function ButtonDocRow({ example }: { example: ButtonExample }) {
  return (
    <article className="doc-row">
      <div className="doc-header">
        <h3>{example.title}</h3>
        <div className="doc-token-list">
          {example.tokens.map(token => <code key={token}>{token}</code>)}
        </div>
      </div>
      <div className="doc-body">
        <div className="doc-preview">{example.preview}</div>
        <CodeSnippet code={example.code} />
      </div>
    </article>
  )
}

export default function Buttons() {
  return (
    <>
      <div className="page-header">
        <h1>Buttons</h1>
        <p>Button-Arten mit Vorschau, Einsatzkontext und kopierbarem JSX.</p>
      </div>

      <div className="comp-docs">
        {BUTTON_SECTIONS.map(section => (
          <section className="section" key={section.title}>
            <h2 className="section-title">{section.title}</h2>
            <div className="doc-list">
              {section.examples.map(example => (
                <ButtonDocRow example={example} key={example.title} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
