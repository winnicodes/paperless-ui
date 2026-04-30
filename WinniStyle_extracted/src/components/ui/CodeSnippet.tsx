import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

function copyFallback(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

export function CodeSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(code)
    } else {
      copyFallback(code)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="code-snippet">
      <div className="code-snippet-header">
        <span>JSX</span>
        <button className="code-copy-btn" onClick={copyCode} type="button">
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Kopiert' : 'Kopieren'}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  )
}
